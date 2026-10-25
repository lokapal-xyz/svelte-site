import type { Attachment } from 'svelte/attachments';
import type { BirdKind, Pose } from './flock.svelte';

export type WalkPhase = 'idle' | 'walk' | 'jump';

export type Walker = {
	id: BirdKind;
	x: number;
	y: number;
	hop: number;
	facing: 1 | -1;
	pose: Pose;
	phase: WalkPhase;
};

type Motion = {
	tx: number;
	ty: number;
	speed: number;
	idleUntil: number;
	traveled: number;
	jumping: boolean;
	jumpElapsed: number;
};

const KINDS: BirdKind[] = ['dove', 'sparrow', 'jay', 'crow'];
const BIRD_W = 42;
const BIRD_H = 31;
const PAD = 12;
const STEP_PX = 11;
const SPEED_MIN = 48;
const SPEED_MAX = 72;
const JUMP_MS = 420;
const JUMP_H = 34;

function reducedMotion(): boolean {
	return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function rand(min: number, max: number): number {
	return min + Math.random() * (max - min);
}

export class WalkController {
	birds = $state<Walker[]>([]);

	#el: HTMLElement | null = null;
	#width = 0;
	#height = 0;
	#placed = false;
	#static = false;
	#raf = 0;
	#last = 0;
	#ro: ResizeObserver | null = null;
	#motion: Partial<Record<BirdKind, Motion>> = {};

	attachStage: Attachment<HTMLElement> = (el) => {
		this.#bind(el);
		return () => this.#unbind();
	};

	nudge = (id: BirdKind) => {
		if (this.#static || !this.#placed) return;
		const bird = this.birds.find((item) => item.id === id);
		const motion = this.#motion[id];
		if (!bird || !motion || motion.jumping) return;
		motion.jumping = true;
		motion.jumpElapsed = 0;
		bird.phase = 'jump';
		bird.pose = 'wings-up';
	};

	#bind(el: HTMLElement) {
		this.#el = el;
		this.#placed = false;
		this.#last = 0;
		this.#static = reducedMotion();
		this.#measure();
		this.#tryPlace();
		this.#ro = new ResizeObserver(() => this.#onResize());
		this.#ro.observe(el);
		this.#raf = requestAnimationFrame(this.#tick);
	}

	#unbind() {
		this.#el = null;
		this.#placed = false;
		if (this.#raf) cancelAnimationFrame(this.#raf);
		this.#raf = 0;
		this.#ro?.disconnect();
		this.#ro = null;
		this.#motion = {};
		this.birds = [];
	}

	#tick = (now: number) => {
		if (!this.#el) return;
		if (!this.#placed) {
			this.#measure();
			this.#tryPlace();
			this.#raf = requestAnimationFrame(this.#tick);
			return;
		}
		if (this.#static) {
			this.#raf = 0;
			return;
		}
		this.#raf = requestAnimationFrame(this.#tick);
		const dt = this.#last ? Math.min(48, now - this.#last) : 16;
		this.#last = now;
		this.#advance(dt, now);
	};

	#onResize() {
		this.#measure();
		if (!this.#placed) {
			this.#tryPlace();
			return;
		}
		for (const bird of this.birds) {
			bird.x = this.#clampX(bird.x);
			bird.y = this.#clampY(bird.y);
			const motion = this.#motion[bird.id];
			if (!motion) continue;
			motion.tx = this.#clampX(motion.tx);
			motion.ty = this.#clampY(motion.ty);
		}
	}

	#measure() {
		if (!this.#el) return;
		const rect = this.#el.getBoundingClientRect();
		this.#width = rect.width;
		this.#height = rect.height;
	}

	get #minX() {
		return PAD + BIRD_W / 2;
	}

	get #maxX() {
		return Math.max(this.#minX, this.#width - PAD - BIRD_W / 2);
	}

	get #minY() {
		return PAD + BIRD_H;
	}

	get #maxY() {
		return Math.max(this.#minY, this.#height - PAD);
	}

	#clampX(x: number) {
		return Math.min(this.#maxX, Math.max(this.#minX, x));
	}

	#clampY(y: number) {
		return Math.min(this.#maxY, Math.max(this.#minY, y));
	}

	#tryPlace() {
		if (this.#placed) return;
		if (this.#width < 24 || this.#height < 24) return;
		this.#place();
		this.#placed = true;
	}

	#place() {
		const now = performance.now();
		this.birds = KINDS.map((id, i) => {
			const col = i % 2;
			const row = Math.floor(i / 2);
			const spanX = this.#maxX - this.#minX;
			const spanY = this.#maxY - this.#minY;
			const facing: 1 | -1 = i % 2 === 0 ? 1 : -1;
			const x = this.#clampX(this.#minX + spanX * (0.22 + col * 0.52 + rand(-0.1, 0.1)));
			const y = this.#clampY(this.#minY + spanY * (0.22 + row * 0.48 + rand(-0.08, 0.1)));
			const bird: Walker = {
				id,
				x,
				y,
				hop: 0,
				facing,
				pose: 'rest',
				phase: 'idle'
			};
			const dest = this.#dest(bird);
			this.#motion[id] = {
				tx: dest.x,
				ty: dest.y,
				speed: rand(SPEED_MIN, SPEED_MAX),
				idleUntil: now + 90 + i * 160 + rand(0, 160),
				traveled: 0,
				jumping: false,
				jumpElapsed: 0
			};
			return bird;
		});
	}

	#advance(dt: number, now: number) {
		for (const bird of this.birds) {
			const motion = this.#motion[bird.id];
			if (!motion) continue;

			if (motion.jumping) {
				this.#jump(bird, motion, dt, now);
				continue;
			}

			if (now < motion.idleUntil) {
				if (bird.phase !== 'idle') {
					bird.phase = 'idle';
					bird.pose = 'rest';
				}
				continue;
			}

			const dx = motion.tx - bird.x;
			const dy = motion.ty - bird.y;
			const dist = Math.hypot(dx, dy);
			if (dist < 2) {
				this.#arrive(bird, motion, now);
				continue;
			}

			const step = (motion.speed * dt) / 1000;
			const t = Math.min(1, step / dist);
			bird.x += dx * t;
			bird.y += dy * t;
			bird.facing = dx >= 0 ? 1 : -1;
			bird.phase = 'walk';
			motion.traveled += step;
			if (motion.traveled >= STEP_PX) {
				motion.traveled = 0;
				bird.pose = bird.pose === 'walk-a' ? 'walk-b' : 'walk-a';
			} else if (bird.pose === 'rest') {
				bird.pose = 'walk-a';
			}
		}
	}

	#jump(bird: Walker, motion: Motion, dt: number, now: number) {
		motion.jumpElapsed += dt;
		const t = Math.min(1, motion.jumpElapsed / JUMP_MS);
		bird.hop = Math.sin(t * Math.PI) * JUMP_H;
		bird.phase = 'jump';
		bird.pose = t < 0.55 ? 'wings-up' : 'rest';
		if (t < 1) return;
		motion.jumping = false;
		motion.jumpElapsed = 0;
		bird.hop = 0;
		bird.phase = 'idle';
		bird.pose = 'rest';
		motion.idleUntil = now + rand(90, 260);
	}

	#arrive(bird: Walker, motion: Motion, now: number) {
		bird.x = motion.tx;
		bird.y = motion.ty;
		bird.phase = 'idle';
		bird.pose = 'rest';

		if (Math.random() < 0.18) {
			bird.facing = bird.facing === 1 ? -1 : 1;
			motion.idleUntil = now + rand(280, 1100);
			return;
		}

		const dest = this.#dest(bird);
		motion.tx = dest.x;
		motion.ty = dest.y;
		motion.speed = rand(SPEED_MIN, SPEED_MAX);
		motion.traveled = 0;
		motion.idleUntil = now + (Math.random() < 0.32 ? rand(420, 1400) : 0);
	}

	#dest(bird: Walker): { x: number; y: number } {
		const roam = () => ({
			x: rand(this.#minX, this.#maxX),
			y: rand(this.#minY, this.#maxY)
		});
		if (Math.random() < 0.34) return roam();
		const radius = rand(56, 220);
		const angle = rand(0, Math.PI * 2);
		const next = {
			x: this.#clampX(bird.x + Math.cos(angle) * radius),
			y: this.#clampY(bird.y + Math.sin(angle) * radius * 0.45)
		};
		if (Math.hypot(next.x - bird.x, next.y - bird.y) < 28) return roam();
		return next;
	}
}

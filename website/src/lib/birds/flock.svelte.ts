import { createContext } from 'svelte';
import type { Attachment } from 'svelte/attachments';

export type BirdKind = 'dove' | 'sparrow' | 'jay' | 'crow';
export type Pose = 'rest' | 'wings-up' | 'wings-down' | 'walk-a' | 'walk-b';
export type Phase = 'idle' | 'hop' | 'scatter';

export type Bird = {
	id: BirdKind;
	perch: number;
	slot: number;
	x: number;
	y: number;
	pose: Pose;
	facing: 1 | -1;
	phase: Phase;
	bobDelay: string;
};

const KINDS: BirdKind[] = ['dove', 'sparrow', 'jay', 'crow'];
const INITIAL_PERCHES = [0, 1, 4, 5];
const SLOT_T = [0.22, 0.5, 0.78];
const HOP_MS = 540;
const SCATTER_MS = 780;

function reducedMotion(): boolean {
	return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function rand(min: number, max: number): number {
	return min + Math.random() * (max - min);
}

function pick<T>(items: T[]): T {
	return items[Math.floor(Math.random() * items.length)];
}

export class FlockController {
	birds = $state<Bird[]>([]);
	active = $state(false);

	#gates: HTMLElement | null = null;
	#rects: DOMRect[] = [];
	#gen = 0;
	#scattered = false;
	#hopping = false;
	#ro: ResizeObserver | null = null;
	#hopTimer: number | null = null;
	#hopEndTimer: number | null = null;
	#flapTimer: number | null = null;
	#preenTimer: number | null = null;
	#scatterTimer: number | null = null;

	attachGates: Attachment<HTMLElement> = (el) => {
		this.#bind(el);
		return () => this.#unbind();
	};

	scatter = () => {
		if (this.#scattered || !this.active || this.birds.length === 0) return;
		if (reducedMotion()) return;

		this.#scattered = true;
		this.#gen += 1;
		this.#clearTimers(false);
		this.#startFlap();

		const flights = this.birds.map((bird) => {
			const dir: 1 | -1 = bird.x < window.innerWidth / 2 ? -1 : 1;
			bird.phase = 'scatter';
			bird.facing = dir;
			bird.pose = 'wings-up';
			return { bird, x: bird.x + dir * rand(90, 220), y: bird.y - rand(160, 280) };
		});

		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				for (const { bird, x, y } of flights) {
					if (bird.phase !== 'scatter') continue;
					bird.x = x;
					bird.y = y;
				}
			});
		});

		const gen = this.#gen;
		this.#scatterTimer = window.setTimeout(() => {
			if (gen !== this.#gen) return;
			this.#stopFlap();
			this.birds = [];
			this.active = false;
			this.#scattered = false;
		}, SCATTER_MS);
	};

	#bind(el: HTMLElement) {
		this.#gates = el;
		this.#gen += 1;
		this.#scattered = false;
		this.#hopping = false;
		this.#observe();
		this.#scheduleSpawn();
	}

	#unbind() {
		this.#gates = null;
		this.#unobserve();
		if (!this.#scattered) {
			this.#gen += 1;
			this.#clearTimers(true);
			this.birds = [];
			this.active = false;
		}
	}

	#observe() {
		this.#unobserve();
		if (!this.#gates) return;
		this.#ro = new ResizeObserver(() => this.#measureAndSync());
		this.#ro.observe(this.#gates);
		window.addEventListener('scroll', this.#onScroll, { passive: true });
		window.addEventListener('resize', this.#onScroll);
	}

	#unobserve() {
		this.#ro?.disconnect();
		this.#ro = null;
		window.removeEventListener('scroll', this.#onScroll);
		window.removeEventListener('resize', this.#onScroll);
	}

	#onScroll = () => this.#measureAndSync();

	#scheduleSpawn() {
		const gen = this.#gen;
		const started = performance.now();
		const tick = () => {
			if (gen !== this.#gen || !this.#gates) return;
			const roostsUp =
				reducedMotion() ||
				Number.parseFloat(getComputedStyle(this.#gates).opacity) > 0.04 ||
				performance.now() - started > 1200;
			if (!roostsUp) {
				requestAnimationFrame(tick);
				return;
			}
			this.#measure();
			this.#placeInitial();
			this.active = true;
			if (!reducedMotion()) {
				this.#armHop();
				this.#armPreen();
			}
		};
		requestAnimationFrame(tick);
	}

	#measure() {
		if (!this.#gates) return;
		this.#rects = [...this.#gates.querySelectorAll('a')].map((node) =>
			node.getBoundingClientRect()
		);
	}

	#measureAndSync() {
		if (this.#scattered || !this.active) return;
		this.#measure();
		this.#syncIdle();
	}

	#placeInitial() {
		const n = this.#rects.length;
		if (n === 0) return;
		this.birds = KINDS.map((id, i) => {
			const perch = INITIAL_PERCHES[i] % n;
			const slot = 1;
			const point = this.#point(perch, slot);
			const facing: 1 | -1 = i % 2 === 0 ? 1 : -1;
			return {
				id,
				perch,
				slot,
				x: point.x,
				y: point.y,
				pose: 'rest' as const,
				facing,
				phase: 'idle' as const,
				bobDelay: `${(-i * 0.7).toFixed(2)}s`
			};
		});
	}

	#point(perch: number, slot: number): { x: number; y: number } {
		const rect = this.#rects[perch];
		const t = SLOT_T[slot] ?? 0.5;
		return {
			x: rect.left + rect.width * t,
			y: rect.top + 1
		};
	}

	#slotFor(perch: number, birdId: BirdKind): number {
		const taken = this.birds
			.filter((bird) => bird.perch === perch && bird.id !== birdId)
			.map((bird) => bird.slot);
		for (const slot of [1, 0, 2]) {
			if (!taken.includes(slot)) return slot;
		}
		return 1;
	}

	#syncIdle() {
		if (this.#rects.length === 0) return;
		for (const bird of this.birds) {
			if (bird.phase !== 'idle') continue;
			const point = this.#point(bird.perch, bird.slot);
			bird.x = point.x;
			bird.y = point.y;
		}
	}

	#armHop() {
		this.#clearHop();
		if (this.#scattered || reducedMotion()) return;
		this.#hopTimer = window.setTimeout(
			() => this.#hop(),
			this.birds.every((bird) => bird.phase === 'idle') ? rand(2400, 4200) : rand(2800, 5600)
		);
	}

	#hop() {
		if (this.#scattered || this.#hopping || !this.active) return;
		const idle = this.birds.filter((bird) => bird.phase === 'idle');
		if (idle.length === 0 || this.#rects.length < 2) {
			this.#armHop();
			return;
		}

		const bird = pick(idle);
		let dest = Math.floor(Math.random() * this.#rects.length);
		if (dest === bird.perch) dest = (dest + 1) % this.#rects.length;
		const slot = this.#slotFor(dest, bird.id);
		const point = this.#point(dest, slot);
		const dx = point.x - bird.x;

		this.#hopping = true;
		bird.phase = 'hop';
		bird.facing = dx >= 0 ? 1 : -1;
		bird.pose = 'wings-up';
		bird.perch = dest;
		bird.slot = slot;
		this.#startFlap();
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				if (bird.phase !== 'hop') return;
				bird.x = point.x;
				bird.y = point.y;
			});
		});

		this.#hopEndTimer = window.setTimeout(() => {
			this.#hopEndTimer = null;
			if (this.#scattered) return;
			if (bird.phase === 'hop') {
				bird.phase = 'idle';
				bird.pose = 'rest';
			}
			this.#hopping = false;
			this.#stopFlap();
			this.#armHop();
		}, HOP_MS);
	}

	#armPreen() {
		this.#clearPreen();
		if (this.#scattered || reducedMotion()) return;
		this.#preenTimer = window.setTimeout(() => this.#preen(), rand(4000, 8000));
	}

	#preen() {
		if (this.#scattered || this.#hopping) {
			this.#armPreen();
			return;
		}
		const idle = this.birds.filter((bird) => bird.phase === 'idle');
		if (idle.length) {
			const bird = pick(idle);
			bird.pose = 'wings-down';
			window.setTimeout(() => {
				if (bird.phase === 'idle') bird.pose = 'rest';
			}, 220);
		}
		this.#armPreen();
	}

	#startFlap() {
		this.#stopFlap();
		this.#flapTimer = window.setInterval(() => {
			for (const bird of this.birds) {
				if (bird.phase === 'idle') continue;
				bird.pose = bird.pose === 'wings-up' ? 'wings-down' : 'wings-up';
			}
		}, 90);
	}

	#stopFlap() {
		if (this.#flapTimer !== null) {
			clearInterval(this.#flapTimer);
			this.#flapTimer = null;
		}
	}

	#clearHop() {
		if (this.#hopTimer !== null) {
			clearTimeout(this.#hopTimer);
			this.#hopTimer = null;
		}
		if (this.#hopEndTimer !== null) {
			clearTimeout(this.#hopEndTimer);
			this.#hopEndTimer = null;
		}
	}

	#clearPreen() {
		if (this.#preenTimer !== null) {
			clearTimeout(this.#preenTimer);
			this.#preenTimer = null;
		}
	}

	#clearHopAndPreen() {
		this.#clearHop();
		this.#clearPreen();
	}

	#clearTimers(includingScatter: boolean) {
		this.#clearHopAndPreen();
		this.#stopFlap();
		if (includingScatter && this.#scatterTimer !== null) {
			clearTimeout(this.#scatterTimer);
			this.#scatterTimer = null;
		}
	}
}

export const [getFlock, setFlock] = createContext<FlockController>();

import { createContext } from 'svelte';

export class TermPanelState {
	openId = $state<string | null>(null);
	expanded = $state(false);
	x = $state(0);
	y = $state(0);
	generation = $state(0);

	open(id: string, x: number, y: number) {
		this.openId = id;
		this.expanded = false;
		this.x = x;
		this.y = y;
		this.generation += 1;
	}

	close() {
		this.openId = null;
		this.expanded = false;
	}

	toggleExpanded() {
		this.expanded = !this.expanded;
	}
}

export const [getTermPanel, setTermPanel] = createContext<TermPanelState>();

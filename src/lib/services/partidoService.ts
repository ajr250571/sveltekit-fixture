import { writable, type Writable } from 'svelte/store';

export interface Partido {
	id: number;
	fixtureId: number;
	fecha: Date;
	equipo_ganador: number;
}
export const partidos: Writable<Partido[]> = writable([]);

export async function fetchPartidos(): Promise<void> {
	const response = await fetch('/api/partido');
	const data: Partido[] = await response.json();
	partidos.set(data);
}

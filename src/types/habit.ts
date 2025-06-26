export type HabitDificult = "Trivial" | "Fácil" | "Médio" | "Difícil";

export type HabitReset = "Diariamente" | "Semanalmente" | "Mensalmente";

export interface Habit {
	id: string;
	title: string;
	observations: string;
	difficult: HabitDificult;
	tags: string[];
	reset: HabitReset;
	createdAt: Date;
}

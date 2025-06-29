export type HabitDifficult = "Trivial" | "Fácil" | "Médio" | "Difícil";

export type HabitReset = "Diariamente" | "Semanalmente" | "Mensalmente";

export interface Habit {
	id: string;
	title: string;
	observations: string;
	difficult: HabitDifficult;
	tags: string[];
	reset: HabitReset;
	createdAt: Date;
}

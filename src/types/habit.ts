export type HabitDifficulty = "Trivial" | "Fácil" | "Médio" | "Difícil";

export type HabitReset = "Diariamente" | "Semanalmente" | "Mensalmente";

export interface Habit {
	id: string;
	title: string;
	observations: string;
	difficulty: HabitDifficulty;
	tags: string[];
	reset: HabitReset;
	createdAt: Date;
	order?: number;
	lastCompletedDate?: string;
}

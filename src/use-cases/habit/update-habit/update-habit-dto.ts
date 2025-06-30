export type Habitdifficulty = "Trivial" | "Fácil" | "Médio" | "Difícil";

export type HabitReset = "Diariamente" | "Semanalmente" | "Mensalmente";

export type UpdateHabitInput = {
	id: string;
	title: string;
	observations: string;
	difficulty: HabitDifficult;
	tags: string[];
	reset: HabitReset;
	createdAt: Date;
};

export type UpdateHabitOutput = {
	id: string;
	title: string;
	observations: string;
	difficulty: HabitDifficult;
	tags: string[];
	reset: HabitReset;
	createdAt: Date;
};

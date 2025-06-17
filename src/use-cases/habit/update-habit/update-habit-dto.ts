export type HabitDificult = "Trivial" | "Fácil" | "Médio" | "Difícil";

export type HabitReset = "Diária" | "Semanal" | "Mensal";

export type UpdateHabitInput = {
	id: string;
	title: string;
	observations: string;
	difficulty: HabitDificult;
	tags: string[];
	reset: HabitReset;
	createdAt: Date;
};

export type UpdateHabitOutput = {
	id: string;
	title: string;
	observations: string;
	difficulty: HabitDificult;
	tags: string[];
	reset: HabitReset;
	createdAt: Date;
};

export type HabitDificult = "Trivial" | "Fácil" | "Médio" | "Difícil";

export type HabitReset = "Diária" | "Semanal" | "Mensal";

export type Habit = {
	id: string;
	title: string;
	observations: string;
	difficulty: HabitDificult;
	tags: string[];
	reset: HabitReset;
	createdAt: Date;
};

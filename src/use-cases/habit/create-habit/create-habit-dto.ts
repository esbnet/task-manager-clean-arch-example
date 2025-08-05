export type HabitDifficulty = "Trivial" | "Fácil" | "Médio" | "Difícil";

export type HabitReset = "Diariamente" | "Semanalmente" | "Mensalmente";

export type CreateHabitInput = {
	title: string;
	observations: string;
	difficulty: HabitDifficulty;
	tags: string[];
	reset: HabitReset;
	createdAt: Date;
};

export type CreateHabitOutput = {
	habit: {
		id: string;
		title: string;
		observations: string;
		difficulty: HabitDifficulty;
		tags: string[];
		reset: HabitReset;
		createdAt: Date;
	};
};

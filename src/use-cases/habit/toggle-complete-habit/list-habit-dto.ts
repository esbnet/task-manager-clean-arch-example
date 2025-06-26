export type HabitDificult = "Trivial" | "Fácil" | "Médio" | "Difícil";

export type HabitReset = "Diariamente" | "Semanalmente" | "Mensalmente";

export type HabitOutput = {
	habit: {
		id: string;
		title: string;
		observations: string;
		difficulty: HabitDificult;
		tags: string[];
		reset: HabitReset;
		createdAt: Date;
	};
};

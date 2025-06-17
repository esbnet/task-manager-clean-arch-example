export type HabitDificult = "Trivial" | "Fácil" | "Médio" | "Difícil";

export type HabitReset = "Diária" | "Semanal" | "Mensal";

export type ListHabitsOutput = {
	habits: {
		id: string;
		title: string;
		observations: string;
		difficulty: HabitDificult;
		tags: string[];
		reset: HabitReset;
		createdAt: Date;
	}[];
};

export type ListHabitsInput = {
	page: number;
	limit: number;
};

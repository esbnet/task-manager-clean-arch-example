export type TodoDifficulty = "Trivial" | "Fácil" | "Médio" | "Difícil";

export interface Todo {
	id: string;
	title: string;
	observations: string;
	tasks: string[];
	difficulty: TodoDifficulty;
	startDate: Date;
	tags: string[];
	createdAt: Date;
	order?: number;
	lastCompletedDate?: string;
}

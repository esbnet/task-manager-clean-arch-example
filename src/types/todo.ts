export type Tododifficulty = "Trivial" | "Fácil" | "Médio" | "Difícil";

export interface Todo {
	id: string;
	title: string;
	observations: string;
	tasks: string[];
	difficulty: TodoDifficult;
	startDate: Date;
	tags: string[];
	createdAt: Date;
}

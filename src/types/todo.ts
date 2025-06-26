export type TodoDificult = "Trivial" | "Fácil" | "Médio" | "Difícil";

export interface Todo {
	id: string;
	title: string;
	observations: string;
	tasks: string[];
	difficult: TodoDificult;
	startDate: Date;
	tags: string[];
	createdAt: Date;
}

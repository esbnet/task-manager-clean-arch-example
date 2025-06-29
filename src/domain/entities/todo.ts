type TodoDifficult = "Trivial" | "Fácil" | "Médio" | "Difícil";

export interface Todo {
	id: string;
	title: string;
	observations: string;
	tasks: string[];
	difficult: TodoDifficult;
	startDate: Date;
	tags: string[];
	createdAt: Date;
}

type TodoDificult = "Trivial" | "Fácil" | "Médio" | "Difícil";

export type Todo = {
	id: string;
	title: string;
	observations: string;
	tasks: string[];
	difficulty: TodoDificult;
	startDate: Date;
	tags: string[];
	createdAt: Date;
};

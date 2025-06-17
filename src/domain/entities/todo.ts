type TodoDificult = "Trivial" | "Fácil" | "Médio" | "Difícil";

export type Todo = {
	id: string;
	title: string;
	observations: string;
	taskList: string[];
	difficulty: TodoDificult;
	startDate: Date;
	tags: string[];
	createdAt: Date;
};

export type TodoDifficult = "Trivial" | "Fácil" | "Médio" | "Difícil";

export type TodoReset = "Diária" | "Semanal" | "Mensal";

export type UpdateTodoInput = {
	id: string;
	title: string;
	observations: string;
	tasks: string[];
	difficult: TodoDifficult;
	startDate: Date;
	tags: string[];
	createdAt: Date;
};

export type UpdateTodoOutput = {
	id: string;
	title: string;
	observations: string;
	tasks: string[];
	difficulty: TodoDifficult;
	startDate: Date;
	tags: string[];
	createdAt: Date;
};

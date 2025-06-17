export type TodoDificult = "Trivial" | "Fácil" | "Médio" | "Difícil";

export type TodoReset = "Diária" | "Semanal" | "Mensal";

export type CreateTodoInput = {
	title: string;
	observations: string;
	tasks: string[];
	difficulty: TodoDificult;
	startDate: Date;
	tags: string[];
	createdAt: Date;
};

export type CreateTodoOutput = {
	todo: {
		id: string;
		title: string;
		observations: string;
		tasks: string[];
		difficulty: TodoDificult;
		startDate: Date;
		tags: string[];
		createdAt: Date;
	};
};

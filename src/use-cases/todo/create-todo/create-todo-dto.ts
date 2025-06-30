export type Tododifficulty = "Trivial" | "Fácil" | "Médio" | "Difícil";

export type TodoReset = "Diária" | "Semanal" | "Mensal";

export type CreateTodoInput = {
	title: string;
	observations: string;
	tasks: string[];
	difficulty: TodoDifficult;
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
		difficulty: TodoDifficult;
		startDate: Date;
		tags: string[];
		createdAt: Date;
	};
};

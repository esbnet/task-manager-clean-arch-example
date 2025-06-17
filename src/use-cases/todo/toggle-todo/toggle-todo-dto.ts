export type TodoDificult = "Trivial" | "Fácil" | "Médio" | "Difícil";

export type TodoReset = "Diária" | "Semanal" | "Mensal";

export type TodoOutput = {
	todo: {
		id: string;
		title: string;
		observations: string;
		taskList: string[];
		difficulty: TodoDificult;
		startDate: Date;
		tags: string[];
		createdAt: Date;
	};
};

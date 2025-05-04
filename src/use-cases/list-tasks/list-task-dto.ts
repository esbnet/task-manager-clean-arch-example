export type ListTasksOutput = {
	tasks: {
		id: string;
		title: string;
		completed: boolean;
		createdAt: Date;
		category: "hábitos" | "diárias" | "afazeres";
		priority: "baixa" | "média" | "alta";
	}[];
};
export type ListTasksInput = {
	page: number;
	limit: number;
};

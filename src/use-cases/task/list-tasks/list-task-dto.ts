export type ListTasksOutput = {
	tasks: {
		id: string;
		title: string;
		completed: boolean;
		createdAt: Date;
		category: "HABITOS" | "DIARIAS" | "AFAZERES";
		priority: "BAIXA" | "MEDIA" | "ALTA";
	}[];
};
export type ListTasksInput = {
	page: number;
	limit: number;
};

export type TaskCategory = "HABITOS" | "DIARIAS" | "AFAZERES";
export type TaskPriority = "BAIXA" | "MEDIA" | "ALTA";

export type Task = {
	id: string;
	title: string;
	completed: boolean;
	category: TaskCategory;
	priority: TaskPriority;
	createdAt: Date;
};

export type Column = {
	id: TaskCategory;
	title: string;
};

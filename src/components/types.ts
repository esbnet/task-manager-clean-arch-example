export type TaskCategory = "HABITOS" | "DIARIAS" | "AFAZERES";
export type TaskPriority = "BAIXA" | "MEDIA" | "ALTA";

export type Task = {
	id: string;
	createdAt: Date;
	title: string;
	completed: boolean;
	category: TaskCategory;
	priority: TaskPriority;
};

export type Column = {
	id: TaskCategory;
	title: string;
};

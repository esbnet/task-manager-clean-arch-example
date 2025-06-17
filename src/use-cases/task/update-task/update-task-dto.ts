type Category = "DIARIAS" | "HABITOS" | "AFAZERES";
type Priority = "BAIXA" | "MEDIA" | "ALTA";

export type UpdateTaskInput = {
	id: string;
	title: string;
	completed: boolean;
	createdAt: Date;
	category: Category;
	priority: Priority;
};

export type UpdateTaskOutput = {
	id: string;
	title: string;
	completed: boolean;
	createdAt: Date;
	category: Category;
	priority: Priority;
};

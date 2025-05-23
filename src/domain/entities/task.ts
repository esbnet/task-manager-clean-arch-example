type Category = "DIARIAS" | "HABITOS" | "AFAZERES";
type Priority = "BAIXA" | "MEDIA" | "ALTA";

export type Task = {
	id: string;
	createdAt: Date;
	title: string;
	completed: boolean;
	category: Category;
	priority: Priority;
};

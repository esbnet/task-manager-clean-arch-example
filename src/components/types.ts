export type TaskCategory = "HABITOS" | "DIARIAS" | "AFAZERES";
export type Priority = "BAIXA" | "MEDIA" | "ALTA";

export type Task = {
	id: string;
	createdAt: Date;
	title: string;
	completed: boolean;
	category: TaskCategory;
	priority: Priority;
}

export type Column = {
  id: TaskCategory;
  title: string;
};


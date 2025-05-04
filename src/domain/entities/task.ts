export interface Task {
	id: string;
	createdAt: Date;
	title: string;
	completed: boolean;
	category: "hábitos" | "diárias" | "afazeres";
	priority: "baixa" | "média" | "alta";
}

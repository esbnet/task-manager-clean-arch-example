export interface TodoSubtask {
	id: string;
	title: string;
	completed: boolean;
	todoId: string;
	order: number;
	createdAt: Date;
}

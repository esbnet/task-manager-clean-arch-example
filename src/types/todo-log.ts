export interface TodoLog {
	id: string;
	todoId: string;
	todoTitle: string;
	completedAt: Date;
	difficulty: string;
	tags: string[];
}

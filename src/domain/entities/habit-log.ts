export interface HabitLog {
	id: string;
	habitId: string;
	habitTitle: string;
	completedAt: Date;
	difficulty: string;
	tags: string[];
	createdAt: Date;
}

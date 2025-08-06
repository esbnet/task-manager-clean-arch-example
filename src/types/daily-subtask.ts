export interface DailySubtask {
	id: string;
	title: string;
	completed: boolean;
	dailyId: string;
	order: number;
	createdAt: Date;
}

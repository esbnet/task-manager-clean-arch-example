export interface DailyLog {
	id: string;
	dailyId: string;
	dailyTitle: string;
	completedAt: Date;
	difficulty: string;
	tags: string[];
}
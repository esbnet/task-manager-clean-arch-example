export type DailyDifficulty = "Trivial" | "Fácil" | "Médio" | "Difícil";

export type DailyRepeatType =
	| "Diariamente"
	| "Semanalmente"
	| "Mensalmente"
	| "Anualmente";

export interface DailyRepeat {
	type: DailyRepeatType;
	frequency: number;
}

export interface Daily {
	id: string;
	title: string;
	observations: string;
	tasks: string[];
	difficulty: DailyDifficulty;
	startDate: Date;
	repeat: DailyRepeat;
	tags: string[];
	createdAt: Date;
}

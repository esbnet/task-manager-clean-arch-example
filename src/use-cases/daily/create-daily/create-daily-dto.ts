export type DailyDificult = "Trivial" | "Fácil" | "Médio" | "Difícil";

type DailyRepeatType =
	| "Diariamente"
	| "Semanalmente"
	| "Mensalmente"
	| "Anualmente";

interface DailyRepeat {
	type: DailyRepeatType;
	frequency: number;
}

export interface CreateDailyInput {
	id: string;
	title: string;
	observations: string;
	tasks?: string[];
	difficulty: DailyDificult;
	startDate: Date;
	repeat?: DailyRepeat;
	tags: string[];
	createdAt: Date;
}

export interface CreateDailyOutput {
	daily: {
		id: string;
		title: string;
		observations: string;
		taskList?: string[];
		difficulty: DailyDificult;
		startDate: Date;
		repeat?: DailyRepeat;
		tags?: string[];
		createdAt: Date;
	};
}

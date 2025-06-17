export type DailyDificult = "Trivial" | "Fácil" | "Médio" | "Difícil";

type DailyRepeatType =
	| "Diária"
	| "Semanalmente"
	| "Mensalmente"
	| "Anualemente";

type DailyRepeat = {
	type: DailyRepeatType;
	frequency: number;
};

export type UpdateDailyInput = {
	id: string;
	title: string;
	observations: string;
	tasks: string[];
	difficulty: DailyDificult;
	startDate: Date;
	repeat: DailyRepeat;
	tags: string[];
	createdAt: Date;
};

export type UpdateDailyOutput = {
	daily: {
		id: string;
		title: string;
		observations: string;
		tasks?: string[];
		difficulty: DailyDificult;
		startDate: Date;
		repeat?: DailyRepeat;
		tags?: string[];
		createdAt: Date;
	};
};

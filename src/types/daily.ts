export type DailyDificult = "Trivial" | "Fácil" | "Médio" | "Difícil";

export type DailyRepeatType =
	| "Diária"
	| "Semanalmente"
	| "Mensalmente"
	| "Anualemente";

export type DailyRepeat = {
	type: DailyRepeatType;
	frequency: number;
};

export type Daily = {
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

type DailyDificult = "Trivial" | "Fácil" | "Médio" | "Difícil";

type DailyRepeatType =
	| "Diária"
	| "Semanalmente"
	| "Mensalmente"
	| "Anualemente";

type DailyRepeat = {
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

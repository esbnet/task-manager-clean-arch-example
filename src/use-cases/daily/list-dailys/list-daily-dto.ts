import type { Daily } from "@/types";

export type ListDailyOutput = {
	dailys: Daily[];
};
export type ListDailyInput = {
	page: number;
	limit: number;
};

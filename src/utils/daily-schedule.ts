import type { Daily } from "@/types";
import {
	addDays,
	addMonths,
	addWeeks,
	addYears,
	isAfter,
	isSameDay,
} from "date-fns";

export function shouldShowDailyToday(daily: Daily): boolean {
	const today = new Date();
	const startDate = new Date(daily.startDate);

	// Se ainda não chegou na data de início
	if (isAfter(startDate, today)) {
		return false;
	}

	// Se foi concluída hoje, não mostrar
	if (daily.lastCompletedDate === today.toISOString().split("T")[0]) {
		return false;
	}

	// Para tarefas diárias, sempre mostrar se não foi concluída hoje
	if (daily.repeat.type === "Diariamente") {
		return true;
	}

	// Se é o primeiro dia (data de início)
	if (isSameDay(startDate, today)) {
		return true;
	}

	const { type, frequency } = daily.repeat;
	let nextDate = new Date(startDate);

	// Calcula as próximas datas baseado na repetição
	while (!isAfter(nextDate, today)) {
		if (isSameDay(nextDate, today)) {
			return true;
		}

		switch (type) {
			case "Semanalmente":
				nextDate = addWeeks(nextDate, frequency);
				break;
			case "Mensalmente":
				nextDate = addMonths(nextDate, frequency);
				break;
			case "Anualmente":
				nextDate = addYears(nextDate, frequency);
				break;
			default:
				return false;
		}
	}

	return false;
}

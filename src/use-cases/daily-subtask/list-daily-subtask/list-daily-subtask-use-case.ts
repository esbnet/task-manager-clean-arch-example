import type { DailySubtaskRepository } from "@/domain/repositories/all-repository";
import type { DailySubtask } from "@/domain/entities/daily-subtask";

export interface ListDailySubtaskInput {
	dailyId: string;
}

export interface ListDailySubtaskOutput {
	subtasks: DailySubtask[];
}

export class ListDailySubtaskUseCase {
	constructor(private dailySubtaskRepository: DailySubtaskRepository) {}

	async execute(input: ListDailySubtaskInput): Promise<ListDailySubtaskOutput> {
		const subtasks = await this.dailySubtaskRepository.listByDailyId(input.dailyId);
		return { subtasks };
	}
}
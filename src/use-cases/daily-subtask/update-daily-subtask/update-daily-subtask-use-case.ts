import type { DailySubtaskRepository } from "@/domain/repositories/all-repository";
import type { DailySubtask } from "@/domain/entities/daily-subtask";

export interface UpdateDailySubtaskInput {
	subtask: DailySubtask;
}

export interface UpdateDailySubtaskOutput {
	subtask: DailySubtask;
}

export class UpdateDailySubtaskUseCase {
	constructor(private dailySubtaskRepository: DailySubtaskRepository) {}

	async execute(input: UpdateDailySubtaskInput): Promise<UpdateDailySubtaskOutput> {
		const subtask = await this.dailySubtaskRepository.update(input.subtask);
		return { subtask };
	}
}
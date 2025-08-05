import type { DailyLogRepository } from "@/domain/repositories/all-repository";
import type { Daily } from "@/domain/entities/daily";

export interface CompleteDailyInput {
	daily: Daily;
}

export interface CompleteDailyOutput {
	success: boolean;
	logId: string;
}

export class CompleteDailyUseCase {
	constructor(private dailyLogRepository: DailyLogRepository) {}

	async execute(input: CompleteDailyInput): Promise<CompleteDailyOutput> {
		const log = await this.dailyLogRepository.create({
			dailyId: input.daily.id,
			dailyTitle: input.daily.title,
			difficulty: input.daily.difficulty,
			tags: input.daily.tags,
		});

		return {
			success: true,
			logId: log.id,
		};
	}
}
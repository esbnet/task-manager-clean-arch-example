import type { UpdateDailyInput, UpdateDailyOutput } from "./update-daily-dto";

import type { DailyRepository } from "@/domain/repositories/daily-repository";

export class UpdateDailyUseCase {
	constructor(private readonly dailyRepository: DailyRepository) {}

	async execute(inputDaily: UpdateDailyInput): Promise<UpdateDailyOutput> {
		const daily = await this.dailyRepository.update(inputDaily);

		return { daily } as UpdateDailyOutput;
	}
}

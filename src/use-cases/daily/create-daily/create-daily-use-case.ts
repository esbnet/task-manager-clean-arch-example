import type { CreateDailyInput, CreateDailyOutput } from "./create-daily-dto";

import type { DailyRepository } from "@/domain/repositories/all-repository";
import type { DailyDificult } from "@/types/daily";

export class CreateDailyUseCase {
	constructor(private readonly dailyRepository: DailyRepository) {}

	async execute(
		inputDaily: Omit<CreateDailyInput, "id">,
	): Promise<CreateDailyOutput> {
		const daily = await this.dailyRepository.create({
			title: inputDaily.title,
			observations: "",
			tasks: [],
			difficulty: (inputDaily.difficulty as DailyDificult) ?? "Fácil",
			startDate: new Date(),
			repeat: {
				type: "Diária",
				frequency: 1,
			},
			tags: [],
		});

		return {
			daily,
		};
	}
}

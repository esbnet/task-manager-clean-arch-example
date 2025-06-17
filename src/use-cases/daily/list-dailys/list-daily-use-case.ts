import type { DailyRepository } from "@/domain/repositories/all-repository";
import type { ListDailyOutput } from "./list-daily-dto";

export class ListDailysUseCase {
	constructor(private readonly dailyRepository: DailyRepository) {}

	async execute(): Promise<ListDailyOutput> {
		const dailys = await this.dailyRepository.list();

		return { dailys } as ListDailyOutput;
	}
}

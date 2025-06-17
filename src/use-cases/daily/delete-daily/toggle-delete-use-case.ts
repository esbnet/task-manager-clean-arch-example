import type { DailyRepository } from "@/domain/repositories/daily-repository";

export class DeleteDailyUseCase {
	constructor(private readonly dailyRepository: DailyRepository) {}

	async execute(id: string): Promise<void> {
		await this.dailyRepository.delete(id);
		return;
	}
}

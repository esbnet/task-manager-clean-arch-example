import type { HabitRepository } from "@/domain/repositories/habit-repository";

export class DeleteHabitUseCase {
	constructor(private readonly habitRepository: HabitRepository) {}

	async execute(id: string): Promise<void> {
		await this.habitRepository.delete(id);
		return;
	}
}

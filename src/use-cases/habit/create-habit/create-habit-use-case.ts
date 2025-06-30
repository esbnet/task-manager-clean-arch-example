import type {
	CreateHabitInput,
	CreateHabitOutput,
	HabitReset,
} from "./create-habit-dto";

import type { HabitRepository } from "@/domain/repositories/all-repository";

export class CreateHabitUseCase {
	constructor(private readonly habitRepository: HabitRepository) {}

	async execute(inputHabit: CreateHabitInput): Promise<CreateHabitOutput> {
		const habit = await this.habitRepository.create({
			title: inputHabit.title,
			observations: inputHabit.observations,
			difficulty: (inputHabit.difficultyas HabitDificult) ?? "Trivial",
			tags: inputHabit.tags ?? [],
			reset: (inputHabit.reset as HabitReset) ?? "diária",
		});

		return {
			habit,
		};
	}
}

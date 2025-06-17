import type { TaskRepository } from "@/domain/repositories/task-repository";
import type { TaskOutput } from "./list-daily-dto";

export class ToggleCompleteUseCase {
	constructor(private readonly taskRepository: TaskRepository) {}

	async execute(id: string): Promise<TaskOutput> {
		const task = await this.taskRepository.toggleComplete(id);

		return { task };
	}
}

import type { TaskOutput } from "./list-task-dto";
import type { TaskRepository } from "@/domain/repositories/task-repository";

export class ToggleCompleteUseCase {
	constructor(private readonly taskRepository: TaskRepository) {}

	async execute(id: string): Promise<TaskOutput> {
		const task = await this.taskRepository.toggleComplete(id);

		return { task };
	}
}

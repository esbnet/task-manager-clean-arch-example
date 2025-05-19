import type { UpdateTaskInput, UpdateTaskOutput } from "./update-task-dto";

import type { TaskRepository } from "@/domain/repositories/task-repository";

export class UpdateTaskUseCase {
	constructor(private readonly taskRepository: TaskRepository) {}

	async execute(inputTask: UpdateTaskInput): Promise<UpdateTaskOutput> {
		const task = await this.taskRepository.update(inputTask);
		return task;
	}
}

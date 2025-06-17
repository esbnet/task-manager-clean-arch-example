import type { TaskCategory, TaskPriority } from "@/types";
import type { CreateTaskInput, CreateTaskOutput } from "./create-task-dto";

import type { TaskRepository } from "@/domain/repositories/task-repository";

export class CreateTaskUseCase {
	constructor(private readonly taskRepository: TaskRepository) {}

	async execute(inputTask: CreateTaskInput): Promise<CreateTaskOutput> {
		const task = await this.taskRepository.create({
			title: inputTask.title,
			completed: false,
			category: (inputTask.category as TaskCategory) ?? "HABITOS",
			priority: (inputTask.priority as TaskPriority) ?? "BAIXA",
		});

		return {
			task,
		};
	}
}

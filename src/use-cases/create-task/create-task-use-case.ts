import type { CreateTaskInput, CreateTaskOutput } from "./create-task-dto";

import type { TaskRepository } from "@/domain/repositories/task-repository";

export class CreateTaskUseCase {
	constructor(private readonly taskRepository: TaskRepository) {}

	async execute(input: CreateTaskInput): Promise<CreateTaskOutput> {
		const task = await this.taskRepository.create({
			title: input.title,
			completed: false,
			category:
				(input.category as "hábitos" | "diárias" | "afazeres") || "hábitos",
			priority: (input.priority as "baixa" | "média" | "alta") || "baixa",
		});

		return {
			task,
		};
	}
}

import type { CreateTaskInput, CreateTaskOutput } from "./create-task-dto";

import type { TaskRepository } from "@/domain/repositories/task-repository";

export class CreateTaskUseCase {
	constructor(private readonly taskRepository: TaskRepository) {}

	async execute(inputTask: CreateTaskInput): Promise<CreateTaskOutput> {
		const task = await this.taskRepository.create({
			title: inputTask.title,
			completed: false,
			category:
				(inputTask.category as "HABITOS" | "DIARIAS" | "AFAZERES") ||
				"HABITOS",
			priority:
				(inputTask.priority as "BAIXA" | "MEDIA" | "ALTA") || "BAIXA",
		});

		return {
			task,
		};
	}
}

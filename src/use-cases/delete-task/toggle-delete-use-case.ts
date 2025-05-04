import type { TaskRepository } from "@/domain/repositories/task-repository";

export class DeleteTaskUseCase {
	constructor(private readonly taskRepository: TaskRepository) {}

	async execute(id: string): Promise<void> {
		const task = await this.taskRepository.toggleComplete(id);

		if (task.completed) {
			await this.taskRepository.delete(id);
		}
		return;
	}
}

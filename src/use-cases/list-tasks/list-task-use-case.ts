import type { TaskRepository } from "@/domain/repositories/task-repository";
import type { ListTasksOutput } from "./list-task-dto";

export class ListTasksUseCase {
	constructor(private readonly taskRepository: TaskRepository) {}

	async execute(): Promise<ListTasksOutput> {
		const tasks = await this.taskRepository.list();

		return {
			tasks,
		};
	}
}

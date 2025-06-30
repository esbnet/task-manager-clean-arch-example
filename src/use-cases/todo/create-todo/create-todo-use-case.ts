import type { CreateTodoInput, CreateTodoOutput } from "./create-todo-dto";

import type { TodoRepository } from "@/domain/repositories/all-repository";

export class CreateTodoUseCase {
	constructor(private readonly todoRepository: TodoRepository) {}

	async execute(inputTodo: CreateTodoInput): Promise<CreateTodoOutput> {
		const todo = await this.todoRepository.create({
			title: inputTodo.title,
			observations: inputTodo.observations,
			tasks: inputTodo.tasks,
			difficulty: inputTodo.difficultyas Tododifficulty,
			startDate: inputTodo.startDate,
			tags: inputTodo.tags,
		});

		return {
			todo,
		};
	}
}

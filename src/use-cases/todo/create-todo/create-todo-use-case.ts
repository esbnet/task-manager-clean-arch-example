import type {
	CreateTodoInput,
	CreateTodoOutput,
	TodoDificult,
} from "./create-todo-dto";

import type { TodoRepository } from "@/domain/repositories/todo-repository";

export class CreateTodoUseCase {
	constructor(private readonly todoRepository: TodoRepository) {}

	async execute(inputTodo: CreateTodoInput): Promise<CreateTodoOutput> {
		const todo = await this.todoRepository.create({
			title: inputTodo.title,
			observations: inputTodo.observations,
			taskList: inputTodo.taskList,
			difficulty: inputTodo.difficulty as TodoDificult,
			startDate: inputTodo.startDate,
			tags: inputTodo.tags,
		});

		return {
			todo,
		};
	}
}

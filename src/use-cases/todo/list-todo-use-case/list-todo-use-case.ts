import type { TodoRepository } from "@/domain/repositories/all-repository";
import type { Todo } from "@/domain/entities/todo";

export interface ListTodoOutput {
	todos: Todo[];
}

export class ListTodoUseCase {
	constructor(private todoRepository: TodoRepository) {}

	async execute(): Promise<ListTodoOutput> {
		const todos = await this.todoRepository.list();
		return { todos };
	}
}
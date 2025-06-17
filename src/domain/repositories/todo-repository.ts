import type { Todo } from "../entities/todo";

export type TodoRepository = {
	list(): Promise<Todo[]>;
	create(todo: Omit<Todo, "id" | "createdAt">): Promise<Todo>;
	update(todo: Todo): Promise<Todo>;
	toggleComplete(id: string): Promise<Todo>;
	delete(id: string): Promise<void>;
};

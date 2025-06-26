import type { Todo } from "@/domain/entities/todo";
import type { TodoRepository } from "@/domain/repositories/all-repository";

export class ApiTodoRepository implements TodoRepository {
	private baseUrl = "/api/todos";

	async list(): Promise<Todo[]> {
		const res = await fetch(this.baseUrl);
		const json = await res.json();
		return json.todos;
	}

	async create(data: Omit<Todo, "id" | "createdAt">): Promise<Todo> {
		const res = await fetch(this.baseUrl, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		});

		const json = await res.json();
		return json.todo;
	}

	async update(todo: Todo): Promise<Todo> {
		const res = await fetch(`${this.baseUrl}`, {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ todo }),
		});

		const json = await res.json();
		return json.todo;
	}

	async toggleComplete(id: string): Promise<Todo> {
		await fetch(this.baseUrl, {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ id }),
		});

		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		return (await this.list()).find((t) => t.id === id)!;
	}

	async delete(id: string): Promise<void> {
		await fetch(this.baseUrl, {
			method: "DELETE",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ id }),
		});
	}
}

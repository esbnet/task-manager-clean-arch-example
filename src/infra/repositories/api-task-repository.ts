import type { Task } from "@/domain/entities/task";
import type { TaskRepository } from "@/domain/repositories/task-repository";

export class ApiTaskRepository implements TaskRepository {
	private baseUrl = "/api/tasks";

	async list(): Promise<Task[]> {
		const res = await fetch(this.baseUrl);
		const json = await res.json();
		return json.tasks || [];
	}

	async create(data: Omit<Task, "id" | "createdAt">): Promise<Task> {
		const res = await fetch(this.baseUrl, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		});

		const json = await res.json();
		return json.task;
	}

	async toggleComplete(id: string): Promise<Task> {
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

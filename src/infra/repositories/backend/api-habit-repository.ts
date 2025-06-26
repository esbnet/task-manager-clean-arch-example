import type { Habit } from "@/domain/entities/habit";
import type { HabitRepository } from "@/domain/repositories/all-repository";

export class ApiHabitRepository implements HabitRepository {
	private baseUrl = "/api/habits";

	async list(): Promise<Habit[]> {
		const res = await fetch(this.baseUrl);
		const json = await res.json();
		return json.habits || [];
	}

	async create(data: Omit<Habit, "id" | "createdAt">): Promise<Habit> {
		const res = await fetch(this.baseUrl, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		});

		const json = await res.json();
		return json.habit;
	}

	async update(habit: Habit): Promise<Habit> {
		const res = await fetch(`${this.baseUrl}`, {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ habit }),
		});

		const json = await res.json();
		return json.habit;
	}

	async toggleComplete(id: string): Promise<Habit> {
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

import type { Daily } from "@/domain/entities/daily";
import type { DailyRepository } from "@/domain/repositories/daily-repository";

export class ApiDailyRepository implements DailyRepository {
	private baseUrl = "/api/dailys";

	async list(): Promise<Daily[]> {
		const res = await fetch(this.baseUrl);
		const json = await res.json();
		return json.dailys || [];
	}

	async create(data: Omit<Daily, "id" | "createdAt">): Promise<Daily> {
		const res = await fetch(this.baseUrl, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		});

		const json = await res.json();
		return json.daily;
	}

	async update(daily: Daily): Promise<Daily> {
		const res = await fetch(`${this.baseUrl}`, {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ daily }),
		});

		const json = await res.json();
		return json.daily;
	}

	async toggleComplete(id: string): Promise<Daily> {
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

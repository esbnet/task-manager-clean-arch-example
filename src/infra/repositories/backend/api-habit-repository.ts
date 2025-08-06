import type { Habit } from "@/domain/entities/habit";
import type { HabitRepository } from "@/domain/repositories/all-repository";
import type { HttpClient } from "@/infra/services/http-client";
import { FetchHttpClient } from "@/infra/services/http-client";

export class ApiHabitRepository implements HabitRepository {
	private baseUrl = "/api/habits";
	private httpClient: HttpClient;

	constructor(httpClient?: HttpClient) {
		this.httpClient = httpClient || new FetchHttpClient();
	}

	async list(): Promise<Habit[]> {
		const json = await this.httpClient.get<{ habits: Habit[] }>(
			this.baseUrl,
		);
		return json.habits || [];
	}

	async create(data: Omit<Habit, "id" | "createdAt">): Promise<Habit> {
		const json = await this.httpClient.post<{ habit: Habit }>(
			this.baseUrl,
			data,
		);
		return json.habit;
	}

	async update(habit: Habit): Promise<Habit> {
		const json = await this.httpClient.patch<{ habit: Habit }>(
			this.baseUrl,
			{ habit },
		);
		return json.habit;
	}

	async toggleComplete(id: string): Promise<Habit> {
		await this.httpClient.patch(this.baseUrl, { id });
		return (await this.list()).find((t) => t.id === id)!;
	}

	async delete(id: string): Promise<void> {
		await this.httpClient.delete(`${this.baseUrl}?id=${id}`);
	}
}

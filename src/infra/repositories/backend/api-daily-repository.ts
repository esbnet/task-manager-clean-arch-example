import type { Daily } from "@/domain/entities/daily";
import type { DailyRepository } from "@/domain/repositories/all-repository";
import { FetchHttpClient } from "@/infra/services/http-client";
import type { HttpClient } from "@/infra/services/http-client";

export class ApiDailyRepository implements DailyRepository {
	private baseUrl = "/api/daily";
	private httpClient: HttpClient;

	constructor(httpClient?: HttpClient) {
		this.httpClient = httpClient || new FetchHttpClient();
	}

	async list(): Promise<Daily[]> {
		const json = await this.httpClient.get<{ daily: Daily[] }>(
			this.baseUrl,
		);
		return json.daily || [];
	}

	async create(data: Omit<Daily, "id" | "createdAt">): Promise<Daily> {
		const json = await this.httpClient.post<{ daily: Daily }>(
			this.baseUrl,
			data,
		);
		return json.daily;
	}

	async update(daily: Daily): Promise<Daily> {
		const json = await this.httpClient.patch<{ daily: Daily }>(
			this.baseUrl,
			{ daily },
		);
		return json.daily;
	}

	async toggleComplete(id: string): Promise<Daily> {
		await this.httpClient.patch(this.baseUrl, { id });
		const daily = (await this.list()).find((t) => t.id === id);
		if (!daily) throw new Error(`Daily with id ${id} not found`);
		return daily;
	}

	async delete(id: string): Promise<void> {
		await this.httpClient.delete(`${this.baseUrl}?id=${id}`);
	}
}

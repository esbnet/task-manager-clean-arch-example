import type { DailyLog } from "@/domain/entities/daily-log";
import type { DailyLogRepository } from "@/domain/repositories/all-repository";
import { FetchHttpClient } from "@/infra/services/http-client";
import type { HttpClient } from "@/infra/services/http-client";

export class ApiDailyLogRepository implements DailyLogRepository {
	private baseUrl = "/api/daily-logs";
	private httpClient: HttpClient;

	constructor(httpClient?: HttpClient) {
		this.httpClient = httpClient || new FetchHttpClient();
	}
	list(): Promise<DailyLog[]> {
		throw new Error("Method not implemented.");
	}
	update(entity: DailyLog): Promise<DailyLog> {
		console.log("update", entity);
		throw new Error("Method not implemented.");
	}

	toggleComplete(id: string): Promise<DailyLog> {
		console.log("toggleComplete", id);
		throw new Error("Method not implemented.");
	}
	delete(id: string): Promise<void> {
		console.log("delete", id);
		throw new Error("Method not implemented.");
	}

	async create(data: Omit<DailyLog, "id" | "createdAt">): Promise<DailyLog> {
		const json = await this.httpClient.post<{ log: DailyLog }>(
			this.baseUrl,
			data,
		);
		return json.log;
	}
}

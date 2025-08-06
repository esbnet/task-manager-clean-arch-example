import type { TodoLog } from "@/domain/entities/todo-log";
import type { TodoLogRepository } from "@/domain/repositories/all-repository";
import { FetchHttpClient } from "@/infra/services/http-client";
import type { HttpClient } from "@/infra/services/http-client";

export class ApiTodoLogRepository implements TodoLogRepository {
	private baseUrl = "/api/todo-logs";
	private httpClient: HttpClient;

	constructor(httpClient?: HttpClient) {
		this.httpClient = httpClient || new FetchHttpClient();
	}
	list(): Promise<TodoLog[]> {
		throw new Error("Method not implemented.");
	}
	update(entity: TodoLog): Promise<TodoLog> {
		throw new Error("Method not implemented.");
	}
	toggleComplete(id: string): Promise<TodoLog> {
		throw new Error("Method not implemented.");
	}
	delete(id: string): Promise<void> {
		throw new Error("Method not implemented.");
	}

	async create(data: Omit<TodoLog, "id" | "createdAt">): Promise<TodoLog> {
		const json = await this.httpClient.post<{ log: TodoLog }>(
			this.baseUrl,
			data,
		);
		return json.log;
	}
}

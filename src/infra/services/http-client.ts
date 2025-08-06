export interface HttpClient {
	get<T>(url: string): Promise<T>;
	post<T>(url: string, data: unknown): Promise<T>;
	patch<T>(url: string, data: unknown): Promise<T>;
	delete(url: string): Promise<void>;
}

export class FetchHttpClient implements HttpClient {
	async get<T>(url: string): Promise<T> {
		const response = await fetch(url);
		if (!response.ok) throw new Error(`HTTP ${response.status}`);
		return response.json();
	}

	async post<T>(url: string, data: unknown): Promise<T> {
		const response = await fetch(url, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		});
		if (!response.ok) throw new Error(`HTTP ${response.status}`);
		return response.json();
	}

	async patch<T>(url: string, data: unknown): Promise<T> {
		const response = await fetch(url, {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		});
		if (!response.ok) throw new Error(`HTTP ${response.status}`);
		return response.json();
	}

	async delete(url: string): Promise<void> {
		const response = await fetch(url, {
			method: "DELETE",
			headers: { "Content-Type": "application/json" },
		});
		if (!response.ok) throw new Error(`HTTP ${response.status}`);
	}
}
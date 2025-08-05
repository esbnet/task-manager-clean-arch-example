import type { Daily } from "@/domain/entities/daily";
import type { DailyRepository } from "@/domain/repositories/all-repository";
import fs from "node:fs";
import path from "node:path";

let daily: Daily[] = [];
const dataPath = path.join(process.cwd(), "src", "data", "daily.json");

export class InJsonFileDailyRepository implements DailyRepository {
	async list(): Promise<Daily[]> {
		const data = fs.readFileSync(dataPath, "utf-8");
		const parsedData = JSON.parse(data);
		const daily = parsedData.daily || [];

		return [...daily];
	}

	async create(data: Omit<Daily, "id" | "createdAt">): Promise<Daily> {
		// Verifica se o diretório existe
		const dirPath = path.dirname(dataPath);
		if (!fs.existsSync(dirPath)) {
			fs.mkdirSync(dirPath, { recursive: true });
		}

		// Lê os dados existentes ou inicializa um array vazio
		if (fs.existsSync(dataPath)) {
			const fileData = fs.readFileSync(dataPath);
			daily = JSON.parse(fileData.toString()).daily || [];
		}

		const newDaily: Daily = {
			id: Math.random().toString(36).substring(7),
			...data,
			createdAt: new Date(),
			order: daily.length,
		};

		daily.push(newDaily);

		// Escreve de volta no arquivo
		fs.writeFileSync(dataPath, JSON.stringify({ daily }, null, 2));

		return newDaily;
	}

	async toggleComplete(id: string): Promise<Daily> {
		// Verifica se o arquivo existe
		if (!fs.existsSync(dataPath)) {
			throw new Error(`File not found: ${dataPath}`);
		}

		// Lê os dados existentes ou inicializa um array vazio
		if (!fs.existsSync(dataPath)) {
			fs.writeFileSync(dataPath, JSON.stringify({ daily: [] }, null, 2));
		}

		// Lê os dados existentes
		const fileData = fs.readFileSync(dataPath);
		daily = JSON.parse(fileData.toString()).daily || [];

		// Verifica se a tarefa existe no array
		const dailyIndex = daily.findIndex((t) => t.id === id);
		if (dailyIndex < 0) throw new Error("Daily not found");

		const daily = daily[dailyIndex];
		// daily.completed = !daily.completed; //TODO: Implementar lógica de toggle completo

		daily[dailyIndex] = daily;

		// Escreve de volta no arquivo
		fs.writeFileSync(dataPath, JSON.stringify({ daily }, null, 2));

		return daily;
	}

	async update(daily: Daily): Promise<Daily> {
		// Verifica se o arquivo existe
		if (!fs.existsSync(dataPath)) {
			throw new Error(`File not found: ${dataPath}`);
		}

		// Lê os dados existentes
		const fileData = fs.readFileSync(dataPath);
		daily = JSON.parse(fileData.toString()).daily || [];

		// Verifica se a tarefa existe no array
		const dailyIndex = daily.findIndex((t) => t.id === daily.id);
		if (dailyIndex < 0) throw new Error("Daily not found");

		// Atualiza a tarefa
		daily[dailyIndex] = { ...daily[dailyIndex], ...daily };

		// Escreve de volta no arquivo
		fs.writeFileSync(dataPath, JSON.stringify({ daily }, null, 2));

		return daily[dailyIndex];
	}

	async delete(id: string): Promise<void> {
		// Verifica se o arquivo existe
		if (!fs.existsSync(dataPath)) {
			throw new Error(`File not found: ${dataPath}`);
		}

		// Lê os dados existentes
		const fileData = fs.readFileSync(dataPath);
		daily = JSON.parse(fileData.toString()).daily || [];

		// Verifica se a tarefa existe no array
		const dailyIndex = daily.findIndex((t) => t.id === id);
		if (dailyIndex < 0) throw new Error("Daily not found");

		// Remove o usuário pelo índice
		daily.splice(dailyIndex, 1);

		// Salva de volta no arquivo
		fs.writeFileSync(dataPath, JSON.stringify({ daily }, null, 2));

		// Atualiza o array em memória
		daily = daily.filter((t) => t.id !== id);

		return;
	}
}

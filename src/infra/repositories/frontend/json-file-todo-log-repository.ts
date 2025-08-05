import fs from "node:fs";
import path from "node:path";
import type { TodoLog } from "@/domain/entities/todo-log";
import type { TodoLogRepository } from "@/domain/repositories/all-repository";

let todoLogs: TodoLog[] = [];
const dataPath = path.join(process.cwd(), "src", "data", "todo-logs.json");

export class InJsonFileTodoLogRepository implements TodoLogRepository {
	async list(): Promise<TodoLog[]> {
		const data = fs.readFileSync(dataPath, "utf-8");
		const parsedData = JSON.parse(data);
		return parsedData.todoLogs || [];
	}

	async create(data: Omit<TodoLog, "id" | "completedAt">): Promise<TodoLog> {
		const dirPath = path.dirname(dataPath);
		if (!fs.existsSync(dirPath)) {
			fs.mkdirSync(dirPath, { recursive: true });
		}

		if (fs.existsSync(dataPath)) {
			const fileData = fs.readFileSync(dataPath);
			todoLogs = JSON.parse(fileData.toString()).todoLogs || [];
		}

		const newLog: TodoLog = {
			id: Math.random().toString(36).substring(7),
			...data,
			completedAt: new Date(),
		};

		todoLogs.push(newLog);
		fs.writeFileSync(dataPath, JSON.stringify({ todoLogs }, null, 2));
		return newLog;
	}

	async update(log: TodoLog): Promise<TodoLog> {
		throw new Error("Update not implemented for todo logs");
	}

	async toggleComplete(id: string): Promise<TodoLog> {
		throw new Error("Toggle complete not implemented for todo logs");
	}

	async delete(id: string): Promise<void> {
		if (!fs.existsSync(dataPath)) {
			throw new Error(`File not found: ${dataPath}`);
		}

		const fileData = fs.readFileSync(dataPath);
		todoLogs = JSON.parse(fileData.toString()).todoLogs || [];

		const logIndex = todoLogs.findIndex((log) => log.id === id);
		if (logIndex < 0) throw new Error("Todo log not found");

		todoLogs.splice(logIndex, 1);
		fs.writeFileSync(dataPath, JSON.stringify({ todoLogs }, null, 2));
	}
}
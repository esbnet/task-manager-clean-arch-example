import fs from "node:fs";
import path from "node:path";
import type { HabitLog } from "@/domain/entities/habit-log";
import type { HabitLogRepository } from "@/domain/repositories/all-repository";

let habitLogs: HabitLog[] = [];
const dataPath = path.join(process.cwd(), "src", "data", "habit-logs.json");

export class InJsonFileHabitLogRepository implements HabitLogRepository {
	async list(): Promise<HabitLog[]> {
		const data = fs.readFileSync(dataPath, "utf-8");
		const parsedData = JSON.parse(data);
		return parsedData.habitLogs || [];
	}

	async create(data: Omit<HabitLog, "id" | "completedAt">): Promise<HabitLog> {
		const dirPath = path.dirname(dataPath);
		if (!fs.existsSync(dirPath)) {
			fs.mkdirSync(dirPath, { recursive: true });
		}

		if (fs.existsSync(dataPath)) {
			const fileData = fs.readFileSync(dataPath);
			habitLogs = JSON.parse(fileData.toString()).habitLogs || [];
		}

		const newLog: HabitLog = {
			id: Math.random().toString(36).substring(7),
			...data,
			completedAt: new Date(),
		};

		habitLogs.push(newLog);
		fs.writeFileSync(dataPath, JSON.stringify({ habitLogs }, null, 2));
		return newLog;
	}

	async update(log: HabitLog): Promise<HabitLog> {
		throw new Error("Update not implemented for habit logs");
	}

	async toggleComplete(id: string): Promise<HabitLog> {
		throw new Error("Toggle complete not implemented for habit logs");
	}

	async delete(id: string): Promise<void> {
		if (!fs.existsSync(dataPath)) {
			throw new Error(`File not found: ${dataPath}`);
		}

		const fileData = fs.readFileSync(dataPath);
		habitLogs = JSON.parse(fileData.toString()).habitLogs || [];

		const logIndex = habitLogs.findIndex((log) => log.id === id);
		if (logIndex < 0) throw new Error("Habit log not found");

		habitLogs.splice(logIndex, 1);
		fs.writeFileSync(dataPath, JSON.stringify({ habitLogs }, null, 2));
	}
}
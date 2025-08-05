import fs from "node:fs";
import path from "node:path";
import type { DailyLog } from "@/domain/entities/daily-log";
import type { DailyLogRepository } from "@/domain/repositories/all-repository";

let dailyLogs: DailyLog[] = [];
const dataPath = path.join(process.cwd(), "src", "data", "daily-logs.json");

export class InJsonFileDailyLogRepository implements DailyLogRepository {
	async list(): Promise<DailyLog[]> {
		const data = fs.readFileSync(dataPath, "utf-8");
		const parsedData = JSON.parse(data);
		return parsedData.dailyLogs || [];
	}

	async create(data: Omit<DailyLog, "id" | "completedAt">): Promise<DailyLog> {
		const dirPath = path.dirname(dataPath);
		if (!fs.existsSync(dirPath)) {
			fs.mkdirSync(dirPath, { recursive: true });
		}

		if (fs.existsSync(dataPath)) {
			const fileData = fs.readFileSync(dataPath);
			dailyLogs = JSON.parse(fileData.toString()).dailyLogs || [];
		}

		const newLog: DailyLog = {
			id: Math.random().toString(36).substring(7),
			...data,
			completedAt: new Date(),
		};

		dailyLogs.push(newLog);
		fs.writeFileSync(dataPath, JSON.stringify({ dailyLogs }, null, 2));
		return newLog;
	}

	async update(log: DailyLog): Promise<DailyLog> {
		throw new Error("Update not implemented for daily logs");
	}

	async toggleComplete(id: string): Promise<DailyLog> {
		throw new Error("Toggle complete not implemented for daily logs");
	}

	async delete(id: string): Promise<void> {
		if (!fs.existsSync(dataPath)) {
			throw new Error(`File not found: ${dataPath}`);
		}

		const fileData = fs.readFileSync(dataPath);
		dailyLogs = JSON.parse(fileData.toString()).dailyLogs || [];

		const logIndex = dailyLogs.findIndex((log) => log.id === id);
		if (logIndex < 0) throw new Error("Daily log not found");

		dailyLogs.splice(logIndex, 1);
		fs.writeFileSync(dataPath, JSON.stringify({ dailyLogs }, null, 2));
	}
}
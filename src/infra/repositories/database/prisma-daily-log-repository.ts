import type { DailyLog } from "@/domain/entities/daily-log";
import type { DailyLogRepository } from "@/domain/repositories/all-repository";
import { prisma } from "@/infra/database/prisma-client";

export class PrismaDailyLogRepository implements DailyLogRepository {
	async list(): Promise<DailyLog[]> {
		const logs = await prisma.dailyLog.findMany({
			orderBy: { completedAt: "desc" },
		});
		return logs.map(this.toDomain);
	}

	async create(data: Omit<DailyLog, "id" | "createdAt">): Promise<DailyLog> {
		const log = await prisma.dailyLog.create({
			data: {
				dailyId: data.dailyId,
				dailyTitle: data.dailyTitle,
				difficulty: data.difficulty,
				tags: data.tags,
				completedAt: data.completedAt,
			},
		});
		return this.toDomain(log);
	}

	async update(log: DailyLog): Promise<DailyLog> {
		throw new Error("Update not implemented for daily logs");
	}

	async toggleComplete(id: string): Promise<DailyLog> {
		// TODO: Implement toggleComplete logic
		console.log(`Toggling complete for daily log with id: ${id}`);
		throw new Error("Toggle complete not implemented for daily logs");
	}

	async delete(id: string): Promise<void> {
		console.log(`Deleting daily log with id: ${id}`);
		await prisma.dailyLog.delete({ where: { id } });
	}

	private toDomain(log: DailyLog): DailyLog {
		return {
			id: log.id,
			dailyId: log.dailyId,
			dailyTitle: log.dailyTitle,
			difficulty: log.difficulty,
			tags: log.tags,
			completedAt: log.completedAt,
			createdAt: log.createdAt,
		};
	}
}

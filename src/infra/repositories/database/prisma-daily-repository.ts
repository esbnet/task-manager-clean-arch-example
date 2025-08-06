import type { Daily } from "@/domain/entities/daily";
import type { DailyRepository } from "@/domain/repositories/all-repository";
import { prisma } from "@/infra/database/prisma-client";

export class PrismaDailyRepository implements DailyRepository {
	async list(): Promise<Daily[]> {
		const daily = await prisma.daily.findMany({
			include: {
				subtasks: {
					orderBy: { order: "asc" },
				},
			},
			orderBy: { order: "asc" },
		});
		return daily.map(this.toDomain);
	}

	async create(data: Omit<Daily, "id" | "createdAt">): Promise<Daily> {
		const daily = await prisma.daily.create({
			data: {
				title: data.title,
				observations: data.observations,
				tasks: data.tasks,
				difficulty: data.difficulty,
				startDate: data.startDate,
				repeatType: data.repeat.type,
				repeatFrequency: data.repeat.frequency,
				tags: data.tags,
				order: data.order ?? 0,
			},
		});
		return this.toDomain(daily);
	}

	async update(daily: Daily): Promise<Daily> {
		const updated = await prisma.daily.update({
			where: { id: daily.id },
			data: {
				title: daily.title,
				observations: daily.observations,
				tasks: daily.tasks,
				difficulty: daily.difficulty,
				startDate: daily.startDate,
				repeatType: daily.repeat.type,
				repeatFrequency: daily.repeat.frequency,
				tags: daily.tags,
				order: daily.order,
				lastCompletedDate: daily.lastCompletedDate,
			},
		});
		return this.toDomain(updated);
	}

	async toggleComplete(id: string): Promise<Daily> {
		const daily = await prisma.daily.findUnique({ where: { id } });
		if (!daily) throw new Error("Daily not found");

		const updated = await prisma.daily.update({
			where: { id },
			data: { lastCompletedDate: new Date().toISOString().split("T")[0] },
		});
		return this.toDomain(updated);
	}

	async delete(id: string): Promise<void> {
		await prisma.daily.delete({ where: { id } });
	}

	// Converts Prisma entity to domain entity

	private toDomain(daily: any): Daily {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		return {
			id: daily.id,
			title: daily.title,
			observations: daily.observations,
			tasks: daily.tasks,
			difficulty: daily.difficulty,
			startDate: daily.startDate,
			repeat: {
				type: daily.repeatType,
				frequency: daily.repeatFrequency,
			},
			tags: daily.tags,
			order: daily.order,
			lastCompletedDate: daily.lastCompletedDate,
			createdAt: daily.createdAt,
			subtasks:
				daily.subtasks?.map((s: any) => ({
					id: s.id,
					title: s.title,
					completed: s.completed,
					dailyId: s.dailyId,
					order: s.order,
					createdAt: s.createdAt,
				})) || [],
		};
	}
}

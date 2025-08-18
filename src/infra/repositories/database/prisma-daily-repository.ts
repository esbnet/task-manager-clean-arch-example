import type { Daily } from "@/domain/entities/daily";
import type { DailyRepository } from "@/domain/repositories/all-repository";
import { getCurrentUserId } from "@/hooks/use-current-user";
import { prisma } from "@/infra/database/prisma-client";

export class PrismaDailyRepository implements DailyRepository {
	async list(): Promise<Daily[]> {
		const userId = await getCurrentUserId();
		if (!userId) {
			return [];
		}

		// retornar todos os dailies do user
		const daily = await prisma.daily.findMany({
			where: { userId },
			include: {
				subtasks: {
					orderBy: { order: "asc" },
				},
			},
		});
		return daily.map(this.toDomain);
	}

	async create(data: Omit<Daily, "id" | "createdAt">): Promise<Daily> {
		const userId = await getCurrentUserId();
		if (!userId) throw new Error("User not authenticated");

		// Verificar se o usuário existe, se não, criar
		await prisma.user.upsert({
			where: { id: userId },
			update: {},
			create: { id: userId },
		});

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
				userId,
			},
		});
		return this.toDomain(daily);
	}

	async update(daily: Daily): Promise<Daily> {
		const userId = await getCurrentUserId();
		if (!userId) throw new Error("User not authenticated");

		const updated = await prisma.daily.update({
			where: { id: daily.id, userId },
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
		const userId = await getCurrentUserId();
		if (!userId) throw new Error("User not authenticated");

		const daily = await prisma.daily.findUnique({ where: { id, userId } });
		if (!daily) throw new Error("Daily not found");

		const updated = await prisma.daily.update({
			where: { id, userId },
			data: { lastCompletedDate: new Date().toISOString().split("T")[0] },
		});
		return this.toDomain(updated);
	}

	async delete(id: string): Promise<void> {
		const userId = await getCurrentUserId();
		if (!userId) throw new Error("User not authenticated");

		await prisma.daily.delete({ where: { id, userId } });
	}

	// Converts Prisma entity to domain entity
	private toDomain(daily: {
		id: string;
		title: string;
		observations: string;
		tasks: string[];
		difficulty: string;
		startDate: Date;
		repeatType: string;
		repeatFrequency: number;
		tags: string[];
		order: number;
		lastCompletedDate: string | null;
		createdAt: Date;
		subtasks?: Array<{
			id: string;
			title: string;
			completed: boolean;
			dailyId: string;
			order: number;
			createdAt: Date;
		}>;
	}): Daily {
		return {
			id: daily.id,
			title: daily.title,
			observations: daily.observations,
			tasks: daily.tasks,
			difficulty: daily.difficulty as Daily["difficulty"],
			startDate: daily.startDate,
			repeat: {
				type: daily.repeatType as Daily["repeat"]["type"],
				frequency: daily.repeatFrequency,
			},
			tags: daily.tags,
			order: daily.order,
			lastCompletedDate: daily.lastCompletedDate || undefined,
			createdAt: daily.createdAt,
			subtasks:
				daily.subtasks?.map((s) => ({
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

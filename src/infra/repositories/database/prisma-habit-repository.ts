import type { Habit } from "@/domain/entities/habit";
import type { HabitRepository } from "@/domain/repositories/all-repository";
import { getCurrentUserId } from "@/hooks/use-current-user";
import { prisma } from "@/infra/database/prisma-client";

export class PrismaHabitRepository implements HabitRepository {
	async list(): Promise<Habit[]> {
		const userId = await getCurrentUserId();
		if (!userId) return [];

		const habits = await prisma.habit.findMany({
			where: { userId },
			orderBy: { order: "asc" },
		});
		return habits.map(this.toDomain);
	}

	async create(data: Omit<Habit, "id" | "createdAt">): Promise<Habit> {
		const userId = await getCurrentUserId();
		if (!userId) throw new Error("User not authenticated");

		// Verificar se o usuário existe, se não, criar
		await prisma.user.upsert({
			where: { id: userId },
			update: {},
			create: { id: userId },
		});

		const habit = await prisma.habit.create({
			data: {
				title: data.title,
				observations: data.observations,
				difficulty: data.difficulty,
				tags: data.tags,
				reset: data.reset,
				order: data.order ?? 0,
				userId,
			},
		});
		return this.toDomain(habit);
	}

	async update(habit: Habit): Promise<Habit> {
		const userId = await getCurrentUserId();
		if (!userId) throw new Error("User not authenticated");

		const updated = await prisma.habit.update({
			where: { id: habit.id, userId },
			data: {
				title: habit.title,
				observations: habit.observations,
				difficulty: habit.difficulty,
				tags: habit.tags,
				reset: habit.reset,
				order: habit.order,
				lastCompletedDate: habit.lastCompletedDate,
			},
		});
		return this.toDomain(updated);
	}

	async toggleComplete(id: string): Promise<Habit> {
		const userId = await getCurrentUserId();
		if (!userId) throw new Error("User not authenticated");

		const habit = await prisma.habit.findUnique({ where: { id, userId } });
		if (!habit) throw new Error("Habit not found");

		const updated = await prisma.habit.update({
			where: { id, userId },
			data: { lastCompletedDate: new Date().toISOString().split("T")[0] },
		});
		return this.toDomain(updated);
	}

	async delete(id: string): Promise<void> {
		const userId = await getCurrentUserId();
		if (!userId) throw new Error("User not authenticated");

		await prisma.habit.delete({ where: { id, userId } });
	}

	private toDomain(habit: {
		id: string;
		title: string;
		observations: string;
		difficulty: string;
		tags: string[];
		reset: string;
		order: number;
		lastCompletedDate: string | null;
		createdAt: Date;
	}): Habit {
		return {
			id: habit.id,
			title: habit.title,
			observations: habit.observations,
			difficulty: habit.difficulty as Habit["difficulty"],
			tags: habit.tags,
			reset: habit.reset as Habit["reset"],
			order: habit.order,
			lastCompletedDate: habit.lastCompletedDate || undefined,
			createdAt: habit.createdAt,
		};
	}
}

import type { Habit } from "@/domain/entities/habit";
import type { HabitRepository } from "@/domain/repositories/all-repository";
import { prisma } from "@/infra/database/prisma-client";

export class PrismaHabitRepository implements HabitRepository {
	async list(): Promise<Habit[]> {
		const habits = await prisma.habit.findMany({
			orderBy: { order: 'asc' }
		});
		return habits.map(this.toDomain);
	}

	async create(data: Omit<Habit, "id" | "createdAt">): Promise<Habit> {
		const habit = await prisma.habit.create({
			data: {
				...data,
				order: data.order ?? 0
			}
		});
		return this.toDomain(habit);
	}

	async update(habit: Habit): Promise<Habit> {
		const updated = await prisma.habit.update({
			where: { id: habit.id },
			data: {
				title: habit.title,
				observations: habit.observations,
				difficulty: habit.difficulty,
				tags: habit.tags,
				reset: habit.reset,
				order: habit.order,
				lastCompletedDate: habit.lastCompletedDate
			}
		});
		return this.toDomain(updated);
	}

	async toggleComplete(id: string): Promise<Habit> {
		const habit = await prisma.habit.findUnique({ where: { id } });
		if (!habit) throw new Error("Habit not found");
		
		const updated = await prisma.habit.update({
			where: { id },
			data: { lastCompletedDate: new Date().toISOString().split('T')[0] }
		});
		return this.toDomain(updated);
	}

	async delete(id: string): Promise<void> {
		await prisma.habit.delete({ where: { id } });
	}

	private toDomain(habit: any): Habit {
		return {
			id: habit.id,
			title: habit.title,
			observations: habit.observations,
			difficulty: habit.difficulty,
			tags: habit.tags,
			reset: habit.reset,
			order: habit.order,
			lastCompletedDate: habit.lastCompletedDate,
			createdAt: habit.createdAt
		};
	}
}
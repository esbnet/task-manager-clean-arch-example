import type { Todo } from "@/domain/entities/todo";
import type { TodoRepository } from "@/domain/repositories/all-repository";
import { getCurrentUserId } from "@/hooks/use-current-user";
import { prisma } from "@/infra/database/prisma-client";

export class PrismaTodoRepository implements TodoRepository {
	async list(): Promise<Todo[]> {
		const userId = await getCurrentUserId();
		if (!userId) return [];

		const todos = await prisma.todo.findMany({
			where: { userId },
			include: {
				subtasks: {
					orderBy: { order: "asc" },
				},
			},
			orderBy: { order: "asc" },
		});
		return todos.map(this.toDomain);
	}

	async create(
		data: Omit<Todo, "id" | "createdAt" | "subtasks">,
	): Promise<Todo> {
		const userId = await getCurrentUserId();
		if (!userId) throw new Error("User not authenticated");

		// Verificar se o usuário existe, se não, criar
		await prisma.user.upsert({
			where: { id: userId },
			update: {},
			create: { id: userId },
		});

		const { ...todoData } = data;
		const todo = await prisma.todo.create({
			data: {
				...todoData,
				order: data.order ?? 0,
				userId,
			},
		});
		return this.toDomain(todo);
	}

	async update(todo: Todo): Promise<Todo> {
		const userId = await getCurrentUserId();
		if (!userId) throw new Error("User not authenticated");

		const updated = await prisma.todo.update({
			where: { id: todo.id, userId },
			data: {
				title: todo.title,
				observations: todo.observations,
				tasks: todo.tasks,
				difficulty: todo.difficulty,
				startDate: todo.startDate,
				tags: todo.tags,
				order: todo.order,
				lastCompletedDate: todo.lastCompletedDate,
			},
		});
		return this.toDomain(updated);
	}

	async toggleComplete(id: string): Promise<Todo> {
		const userId = await getCurrentUserId();
		if (!userId) throw new Error("User not authenticated");

		const todo = await prisma.todo.findUnique({ where: { id, userId } });
		if (!todo) throw new Error("Todo not found");

		const updated = await prisma.todo.update({
			where: { id, userId },
			data: { lastCompletedDate: new Date().toISOString().split("T")[0] },
		});
		return this.toDomain(updated);
	}

	async delete(id: string): Promise<void> {
		const userId = await getCurrentUserId();
		if (!userId) throw new Error("User not authenticated");

		await prisma.todo.delete({ where: { id, userId } });
	}

	private toDomain(todo: {
		id: string;
		title: string;
		observations: string;
		tasks: string[];
		difficulty: string;
		startDate: Date;
		tags: string[];
		order: number;
		lastCompletedDate: string | null;
		createdAt: Date;
		subtasks?: Array<{
			id: string;
			title: string;
			completed: boolean;
			todoId: string;
			order: number;
			createdAt: Date;
		}>;
	}): Todo {
		return {
			id: todo.id,
			title: todo.title,
			observations: todo.observations,
			tasks: todo.tasks,
			difficulty: todo.difficulty as Todo["difficulty"],
			startDate: todo.startDate,
			tags: todo.tags,
			order: todo.order,
			lastCompletedDate: todo.lastCompletedDate || undefined,
			createdAt: todo.createdAt,
			subtasks:
				todo.subtasks?.map((s) => ({
					id: s.id,
					title: s.title,
					completed: s.completed,
					todoId: s.todoId,
					order: s.order,
					createdAt: s.createdAt,
				})) || [],
		};
	}
}

import type { Todo } from "@/domain/entities/todo";
import type { TodoRepository } from "@/domain/repositories/all-repository";
import { prisma } from "@/infra/database/prisma-client";

export class PrismaTodoRepository implements TodoRepository {
	async list(): Promise<Todo[]> {
		const todos = await prisma.todo.findMany({
			include: {
				subtasks: {
					orderBy: { order: "asc" },
				},
			},
			orderBy: { order: "asc" },
		});
		return todos.map(this.toDomain);
	}

	async create(data: Omit<Todo, "id" | "createdAt">): Promise<Todo> {
		const { subtasks, ...todoData } = data;
		const todo = await prisma.todo.create({
			data: {
				...todoData,
				order: data.order ?? 0,
			},
		});
		return this.toDomain(todo);
	}

	async update(todo: Todo): Promise<Todo> {
		const updated = await prisma.todo.update({
			where: { id: todo.id },
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
		const todo = await prisma.todo.findUnique({ where: { id } });
		if (!todo) throw new Error("Todo not found");

		const updated = await prisma.todo.update({
			where: { id },
			data: { lastCompletedDate: new Date().toISOString().split("T")[0] },
		});
		return this.toDomain(updated);
	}

	async delete(id: string): Promise<void> {
		await prisma.todo.delete({ where: { id } });
	}

	private toDomain(todo: any): Todo {
		return {
			id: todo.id,
			title: todo.title,
			observations: todo.observations,
			tasks: todo.tasks,
			difficulty: todo.difficulty,
			startDate: todo.startDate,
			tags: todo.tags,
			order: todo.order,
			lastCompletedDate: todo.lastCompletedDate,
			createdAt: todo.createdAt,
			subtasks:
				todo.subtasks?.map((s: any) => ({
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

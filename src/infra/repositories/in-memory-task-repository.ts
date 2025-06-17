import type { Task } from "@/domain/entities/task";
import type { TaskRepository } from "@/domain/repositories/task-repository";

let tasks: Task[] = [
	{
		id: "1",
		title: "Estudar Clean Arch",
		completed: false,
		createdAt: new Date(),
		category: "DIARIAS",
		priority: "BAIXA",
	},
	{
		id: "2",
		title: "Estudar TypeScript",
		completed: false,
		createdAt: new Date(),
		category: "HABITOS",
		priority: "ALTA",
	},
	{
		id: "3",
		title: "Estudar Next.js",
		completed: false,
		createdAt: new Date(),
		category: "AFAZERES",
		priority: "ALTA",
	},
];

export class InMemoryTaskRepository implements TaskRepository {
	update(task: Task): Promise<Task> {
		console.log("update", task);
		throw new Error("Method not implemented."); // TODO: Implement this method
	}

	async list(): Promise<Task[]> {
		return [...tasks];
	}

	async create(data: Omit<Task, "id" | "createdAt">): Promise<Task> {
		const newTask: Task = {
			id: Math.random().toString(36).substring(7),
			...data,
			createdAt: new Date(),
		};

		tasks.push(newTask);
		return newTask;
	}

	async toggleComplete(id: string): Promise<Task> {
		const taskIndex = tasks.findIndex((t) => t.id === id);
		if (taskIndex < 0) throw new Error("Task not found");

		const task = tasks[taskIndex];
		task.completed = !task.completed;

		tasks[taskIndex] = task;
		return task;
	}

	async delete(id: string): Promise<void> {
		tasks = tasks.filter((t) => t.id !== id);
	}
}

import type { Task } from "../entities/task";

export type TaskRepository = {
	list(): Promise<Task[]>;
	create(task: Omit<Task, "id" | "createdAt">): Promise<Task>;
	update(task: Task): Promise<Task>;
	toggleComplete(id: string): Promise<Task>;
	delete(id: string): Promise<void>;
};

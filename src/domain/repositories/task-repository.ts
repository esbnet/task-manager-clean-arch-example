import type { Task } from "../entities/task";

export interface TaskRepository {
	list(): Promise<Task[]>;
	create(task: Omit<Task, "id" | "createdAt">): Promise<Task>;
	toggleComplete(id: string): Promise<Task>;
	delete(id: string): Promise<void>;
}

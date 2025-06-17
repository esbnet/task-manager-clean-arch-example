import type { Habit } from "../entities/habit";

export type HabitRepository = {
	list(): Promise<Habit[]>;
	create(habit: Omit<Habit, "id" | "createdAt">): Promise<Habit>;
	update(habit: Habit): Promise<Habit>;
	toggleComplete(id: string): Promise<Habit>;
	delete(id: string): Promise<void>;
};

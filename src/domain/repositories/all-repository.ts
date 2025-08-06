import type { Daily } from "../entities/daily";
import type { DailyLog } from "../entities/daily-log";
import type { DailySubtask } from "../entities/daily-subtask";
import type { Habit } from "../entities/habit";
import type { HabitLog } from "../entities/habit-log";
import type { Tag } from "../entities/tag";
import type { Todo } from "../entities/todo";
import type { TodoLog } from "../entities/todo-log";
import type { TodoSubtask } from "../entities/todo-subtask";
import type { GenericRepository } from "./generic-repository";

export interface DailyRepository extends GenericRepository<Daily> {}
export interface DailyLogRepository extends GenericRepository<DailyLog> {}
export interface DailySubtaskRepository extends GenericRepository<DailySubtask> {
	listByDailyId(dailyId: string): Promise<DailySubtask[]>;
}
export interface HabitRepository extends GenericRepository<Habit> {}
export interface HabitLogRepository extends GenericRepository<HabitLog> {}
export interface TagRepository extends GenericRepository<Tag> {}
export interface TodoRepository extends GenericRepository<Todo> {}
export interface TodoLogRepository extends GenericRepository<TodoLog> {}
export interface TodoSubtaskRepository extends GenericRepository<TodoSubtask> {
	listByTodoId(todoId: string): Promise<TodoSubtask[]>;
}

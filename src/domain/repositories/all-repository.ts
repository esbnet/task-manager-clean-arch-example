import type { Daily } from "../entities/daily";
import type { Habit } from "../entities/habit";
import type { HabitLog } from "../entities/habit-log";
import type { Todo } from "../entities/todo";
import type { GenericRepository } from "./generic-repository";

export interface DailyRepository extends GenericRepository<Daily> {}
export interface HabitRepository extends GenericRepository<Habit> {}
export interface HabitLogRepository extends GenericRepository<HabitLog> {}
export interface TodoRepository extends GenericRepository<Todo> {}

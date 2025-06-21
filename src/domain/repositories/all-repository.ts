import type { Daily } from "../entities/daily";
import type { Habit } from "../entities/habit";
import type { Todo } from "../entities/todo";
import type { GenericRepository } from "./generic-repository";

export type DailyRepository = GenericRepository<Daily>;
export type HabitRepository = GenericRepository<Habit>;
export type TodoRepository = GenericRepository<Todo>;

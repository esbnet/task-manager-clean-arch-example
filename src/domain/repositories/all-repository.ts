import type { Daily } from "../entities/daily";
import type { GenericRepository } from "./generic-repository";
import type { Habit } from "../entities/habit";
import type { Task } from "../entities/task";
import type { Todo } from "../entities/todo";

export type DailyRepository = GenericRepository<Daily>;
export type HabitRepository = GenericRepository<Habit>;
export type TodoRepository = GenericRepository<Todo>;
export type TaskRepository = GenericRepository<Task>;

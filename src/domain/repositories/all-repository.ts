import type { Daily } from "../entities/daily";
import type { Habit } from "../entities/habit";
import type { GenericRepository } from "./generic-repository";

export type DailyRepository = GenericRepository<Daily>;
export type HabitRepository = GenericRepository<Habit>;

// This file defines the Habit entity with its properties and types.
// src/domain/entities/habit.ts
// Habits do not have a specific deadline. You can schedule them up to several times a day

export type HabitDifficult = "Trivial" | "Fácil" | "Médio" | "Difícil";

export type HabitReset = "Diariamente" | "Semanalmente" | "Mensalmente";

export interface Habit {
	id: string;
	title: string;
	observations: string;
	difficult: HabitDifficult;
	tags: string[];
	reset: HabitReset;
	createdAt: Date;
}

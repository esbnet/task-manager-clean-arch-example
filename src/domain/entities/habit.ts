// This file defines the Habit entity with its properties and types.
// src/domain/entities/habit.ts
// Habits do not have a specific deadline. You can schedule them up to several times a day

export type HabitDificult = "Trivial" | "Fácil" | "Médio" | "Difícil";

export type HabitReset = "Diária" | "Semanal" | "Mensal";

export type Habit = {
	id: string;
	title: string;
	observations: string;
	difficulty: HabitDificult;
	tags: string[];
	reset: HabitReset;
	createdAt: Date;
};

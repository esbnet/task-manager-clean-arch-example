"use client";

import {
	type ReactNode,
	createContext,
	useContext,
	useEffect,
	useState,
} from "react";

import type { Habit, HabitReset } from "@/types";

import { ApiHabitRepository } from "@/infra/repositories/backend/api-habit-repository";
import type { HabitDifficulty } from "@/types/habit";
import { CreateHabitUseCase } from "@/use-cases/habit/create-habit/create-habit-use-case";
import { UpdateHabitUseCase } from "@/use-cases/habit/update-habit/update-habit-use-case";

interface HabitContextType {
	habits: Habit[];
	isLoading: boolean;
	error: string | null;
	addHabit: (habit: Omit<Habit, "id">) => Promise<void>;
	updateHabit: (habit: Habit) => Promise<void>;
	deleteHabit: (id: string) => Promise<void>;
	toggleComplete: (id: string) => Promise<void>;
	getHabit: (id: string) => Habit | undefined;
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

interface HabitProviderProps {
	children: ReactNode;
}

export function HabitProvider({ children }: HabitProviderProps) {
	const [habits, setHabits] = useState<Habit[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const habitRepository = new ApiHabitRepository();
	const createHabitUseCase = new CreateHabitUseCase(habitRepository);
	const updateHabitUseCase = new UpdateHabitUseCase(habitRepository);

	const fetchHabits = async () => {
		try {
			setIsLoading(true);
			const fetchedHabits = await habitRepository.list();
			setHabits(fetchedHabits as unknown as Habit[]);
			setError(null);
		} catch (err) {
			setError("Failed to fetch habits");
			console.error(err);
		} finally {
			setIsLoading(false);
		}
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		fetchHabits();
	}, []);

	const addHabit = async (habit: Omit<Habit, "id">) => {
		try {
			const result = await createHabitUseCase.execute({
				title: habit.title,
				observations: habit.observations || "",
				difficulty: habit.difficulty as HabitDifficulty,
				tags: habit.tags || [],
				reset: habit.reset as HabitReset,
				createdAt: habit.createdAt || new Date(),
			});

			setHabits((prevHabits) => [...prevHabits, result.habit]);
			// setHabits((prevHabits) => [
			// 	...prevHabits,
			// 	{
			// 		...result.habit,
			// 		category: result.habit.category as HabitCategory,
			// 		priority: result.habit.priority as HabitPriority,
			// 	},
			// ]);
		} catch (err) {
			setError("Failed to add habit");
			console.error(err);
		}
	};

	const updateHabit = async (habit: Habit) => {
		try {
			const updatedHabitOutput = await updateHabitUseCase.execute(habit); // returns UpdateHabitOutput
			const updatedHabit: Habit = {
				...habit,
				...updatedHabitOutput,
			};
			setHabits((prevHabits) =>
				prevHabits.map((t) =>
					t.id === updatedHabit.id ? updatedHabit : t,
				),
			);
		} catch (err) {
			setError("Failed to update habit");
			console.error(err);
		}
	};

	const deleteHabit = async (id: string) => {
		try {
			await habitRepository.delete(id);
			setHabits((prevHabits) =>
				prevHabits.filter((habit) => habit.id !== id),
			);
		} catch (err) {
			setError("Failed to delete habit");
			console.error(err);
		}
	};

	const toggleComplete = async (id: string) => {
		try {
			const updatedHabitFromRepo =
				await habitRepository.toggleComplete(id);

			const updatedHabit: Habit = {
				...updatedHabitFromRepo,
			} as Habit;

			setHabits((prevHabits) =>
				prevHabits.map((habit) =>
					habit.id === id ? updatedHabit : habit,
				),
			);
		} catch (err) {
			setError("Falha ao completar tarefa");
			console.error(err);
		}
	};

	const getHabit = (id: string) => {
		return habits.find((habit) => habit.id === id);
	};

	const value = {
		habits,
		isLoading,
		error,
		addHabit,
		updateHabit,
		deleteHabit,
		toggleComplete,
		getHabit,
	};

	return (
		<HabitContext.Provider value={value}>{children}</HabitContext.Provider>
	);
}

// Custom hook to use the HabitContext
export function useHabitContext() {
	const context = useContext(HabitContext);
	if (context === undefined) {
		throw new Error("useHabitContext must be used within a HabitProvider");
	}
	return context;
}

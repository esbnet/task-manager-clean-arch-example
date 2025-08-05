"use client";

import {
	type ReactNode,
	createContext,
	useContext,
	useEffect,
	useState,
} from "react";

import type { Daily } from "@/types";

import { ApiDailyRepository } from "@/infra/repositories/backend/api-daily-repository";
import type { DailyDifficulty, DailyRepeatType } from "@/types/daily";
import { CreateDailyUseCase } from "@/use-cases/daily/create-daily/create-daily-use-case";
import { UpdateDailyUseCase } from "@/use-cases/daily/update-daily/update-daily-use-case";

interface DailyContextType {
	dailys: Daily[];
	isLoading: boolean;
	error: string | null;
	addDaily: (daily: Omit<Daily, "id" | "createdAt">) => Promise<void>;
	updateDaily: (daily: Daily) => Promise<void>;
	deleteDaily: (id: string) => Promise<void>;
	toggleComplete: (id: string) => Promise<void>;
	getDaily: (id: string) => Daily | undefined;
	reorderDailys: (dailys: Daily[]) => Promise<void>;
	completeDaily: (daily: Daily) => Promise<void>;
}

const DailyContext = createContext<DailyContextType | undefined>(undefined);

interface DailyProviderProps {
	children: ReactNode;
}

export function DailyProvider({ children }: DailyProviderProps) {
	const [dailys, setDailys] = useState<Daily[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const dailyRepository = new ApiDailyRepository();
	const createDailyUseCase = new CreateDailyUseCase(dailyRepository);
	const updateDailyUseCase = new UpdateDailyUseCase(dailyRepository);

	const fetchDailys = async () => {
		try {
			setIsLoading(true);
			const fetchedDailys = await dailyRepository.list();
			setDailys(fetchedDailys as Daily[]);
			setError(null);
		} catch (err) {
			setError("Failed to fetch dailys");
			console.error(err);
		} finally {
			setIsLoading(false);
		}
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		fetchDailys();
	}, []);

	const addDaily = async (daily: Omit<Daily, "id" | "createdAt">) => {
		try {
			const result = await createDailyUseCase.execute({
				title: daily.title,
				observations: daily.observations || "",
				tasks: daily.tasks || [],
				difficulty: (daily.difficulty as DailyDifficulty) || "Fácil",
				startDate: daily.startDate || new Date(),
				tags: daily.tags || [],
				createdAt: new Date(),
				repeat: {
					type:
						(daily.repeat?.type as DailyRepeatType) ||
						"Diariamente",
					frequency: 1,
				},
			});
			setDailys((prevDailys) => [...prevDailys, result.daily as Daily]);
		} catch (err) {
			setError("Failed to add daily");
			console.error(err);
		}
	};

	const updateDaily = async (daily: Daily) => {
		try {
			const updatedDailyOutput = await updateDailyUseCase.execute(daily); // returns UpdateDailyOutput
			const updatedDaily: Daily = {
				...daily,
				...updatedDailyOutput,
			};
			setDailys((prevDailys) =>
				prevDailys.map((t) =>
					t.id === updatedDaily.id ? updatedDaily : t,
				),
			);
		} catch (err) {
			setError("Failed to update daily");
			console.error(err);
		}
	};

	const deleteDaily = async (id: string) => {
		try {
			await dailyRepository.delete(id);
			setDailys((prevDailys) =>
				prevDailys.filter((daily) => daily.id !== id),
			);
		} catch (err) {
			setError("Failed to delete daily");
			console.error(err);
		}
	};

	const toggleComplete = async (id: string) => {
		try {
			const updatedDailyFromRepo =
				await dailyRepository.toggleComplete(id);

			const updatedDaily: Daily = {
				...updatedDailyFromRepo,
			} as Daily;

			setDailys((prevDailys) =>
				prevDailys.map((daily) =>
					daily.id === id ? updatedDaily : daily,
				),
			);
		} catch (err) {
			setError("Falha ao completar tarefa");
			console.error(err);
		}
	};

	const getDaily = (id: string) => {
		return dailys.find((daily) => daily.id === id);
	};

	const reorderDailys = async (reorderedDailys: Daily[]) => {
		try {
			const dailysWithOrder = reorderedDailys.map((daily, index) => ({
				...daily,
				order: index,
			}));
			
			setDailys(dailysWithOrder);
			
			for (const daily of dailysWithOrder) {
				await updateDailyUseCase.execute(daily);
			}
		} catch (err) {
			setError("Failed to reorder dailys");
			console.error(err);
		}
	};

	const completeDaily = async (daily: Daily) => {
		try {
			await fetch("/api/daily-logs", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ daily }),
			});
			
			const today = new Date().toISOString().split('T')[0];
			const updatedDaily = { ...daily, lastCompletedDate: today };
			await updateDailyUseCase.execute(updatedDaily);
			
			setDailys(prevDailys => 
				prevDailys.map(d => d.id === daily.id ? updatedDaily : d)
			);
		} catch (err) {
			setError("Failed to complete daily");
			console.error(err);
		}
	};

	const today = new Date().toISOString().split('T')[0];
	const visibleDailys = dailys.filter(daily => daily.lastCompletedDate !== today);

	const value = {
		dailys: visibleDailys.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
		isLoading,
		error,
		addDaily,
		updateDaily,
		deleteDaily,
		toggleComplete,
		getDaily,
		reorderDailys,
		completeDaily,
	};

	return (
		<DailyContext.Provider value={value}>{children}</DailyContext.Provider>
	);
}

// Custom hook to use the DailyContext
export function useDailyContext() {
	const context = useContext(DailyContext);
	if (context === undefined) {
		throw new Error("useDailyContext must be used within a DailyProvider");
	}
	return context;
}

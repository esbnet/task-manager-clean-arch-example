"use client";

import {
	type ReactNode,
	createContext,
	useContext,
	useEffect,
	useState,
} from "react";

import type { Daily } from "@/types";
import { shouldShowDailyToday } from "@/utils/daily-schedule";

import { ApiDailyLogRepository } from "@/infra/repositories/backend/api-daily-log-repository";
import { ApiDailyRepository } from "@/infra/repositories/backend/api-daily-repository";
import type { DailyDifficulty, DailyRepeatType } from "@/types/daily";
import { CompleteDailyWithLogUseCase } from "@/use-cases/daily/complete-daily-with-log/complete-daily-with-log-use-case";
import { CreateDailyUseCase } from "@/use-cases/daily/create-daily/create-daily-use-case";
import { DeleteDailyUseCase } from "@/use-cases/daily/delete-daily-use-case/delete-daily-use-case";
import { ListDailyUseCase } from "@/use-cases/daily/list-daily-use-case/list-daily-use-case";
import { UpdateDailyUseCase } from "@/use-cases/daily/update-daily/update-daily-use-case";

interface DailyContextType {
	daily: Daily[];
	isLoading: boolean;
	error: string | null;
	addDaily: (daily: Omit<Daily, "id" | "createdAt">) => Promise<void>;
	updateDaily: (daily: Daily) => Promise<void>;
	deleteDaily: (id: string) => Promise<void>;
	toggleComplete: (id: string) => Promise<void>;
	getDaily: (id: string) => Daily | undefined;
	reorderDaily: (daily: Daily[]) => Promise<void>;
	completeDaily: (daily: Daily) => Promise<void>;
}

const DailyContext = createContext<DailyContextType | undefined>(undefined);

interface DailyProviderProps {
	children: ReactNode;
}

export function DailyProvider({ children }: DailyProviderProps) {
	const [daily, setDaily] = useState<Daily[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const dailyRepository = new ApiDailyRepository();
	const createDailyUseCase = new CreateDailyUseCase(dailyRepository);
	const updateDailyUseCase = new UpdateDailyUseCase(dailyRepository);
	const deleteDailyUseCase = new DeleteDailyUseCase(dailyRepository);
	const listDailyUseCase = new ListDailyUseCase(dailyRepository);

	const fetchDaily = async () => {
		try {
			setIsLoading(true);
			const result = await listDailyUseCase.execute();
			setDaily(result.daily as Daily[]);
			setError(null);
		} catch (err) {
			setError("Failed to fetch daily");
			console.error('Daily fetch error:', err);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchDaily();
		// eslint-disable-next-line react-hooks/exhaustive-deps
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
			setDaily((prevDaily) => [...prevDaily, result.daily as Daily]);
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
			setDaily((prevDaily) =>
				prevDaily.map((t) =>
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
			await deleteDailyUseCase.execute({ id });
			setDaily((prevDaily) =>
				prevDaily.filter((daily) => daily.id !== id),
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

			setDaily((prevDaily) =>
				prevDaily.map((daily) =>
					daily.id === id ? updatedDaily : daily,
				),
			);
		} catch (err) {
			setError("Falha ao completar tarefa");
			console.error(err);
		}
	};

	const getDaily = (id: string) => {
		return daily.find((daily) => daily.id === id);
	};

	const reorderDaily = async (reorderedDaily: Daily[]) => {
		try {
			const dailyWithOrder = reorderedDaily.map((daily, index) => ({
				...daily,
				order: index,
			}));

			setDaily(dailyWithOrder);

			for (const daily of dailyWithOrder) {
				await updateDailyUseCase.execute(daily);
			}
		} catch (err) {
			setError("Failed to reorder daily");
			console.error(err);
		}
	};

	const completeDaily = async (daily: Daily) => {
		try {
			const completeDailyWithLogUseCase = new CompleteDailyWithLogUseCase(
				dailyRepository,
				new ApiDailyLogRepository(),
			);

			const result = await completeDailyWithLogUseCase.execute({ daily });
			setDaily((prevDaily) =>
				prevDaily.map((d) =>
					d.id === daily.id ? result.updatedDaily : d,
				),
			);
		} catch (err) {
			setError("Failed to complete daily");
			console.error(err);
		}
	};

	const value = {
		daily: daily
			.filter(shouldShowDailyToday)
			.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
		isLoading,
		error,
		addDaily,
		updateDaily,
		deleteDaily,
		toggleComplete,
		getDaily,
		reorderDaily,
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

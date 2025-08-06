"use client";

import { createContext, useContext, type ReactNode } from "react";
import { PrismaDailySubtaskRepository } from "@/infra/repositories/database/prisma-daily-subtask-repository";
import { CreateDailySubtaskUseCase } from "@/use-cases/daily-subtask/create-daily-subtask/create-daily-subtask-use-case";
import { UpdateDailySubtaskUseCase } from "@/use-cases/daily-subtask/update-daily-subtask/update-daily-subtask-use-case";
import { DeleteDailySubtaskUseCase } from "@/use-cases/daily-subtask/delete-daily-subtask/delete-daily-subtask-use-case";
import { TaskTitle } from "@/domain/value-objects/task-title";
import { ErrorHandler } from "@/infra/services/error-handler";
import type { DailySubtask } from "@/types";

interface DailySubtaskContextType {
	createSubtask: (title: string, dailyId: string, order: number) => Promise<DailySubtask>;
	updateSubtask: (subtask: DailySubtask) => Promise<DailySubtask>;
	deleteSubtask: (id: string) => Promise<void>;
}

const DailySubtaskContext = createContext<DailySubtaskContextType | undefined>(undefined);

const repository = new PrismaDailySubtaskRepository();
const createUseCase = new CreateDailySubtaskUseCase(repository);
const updateUseCase = new UpdateDailySubtaskUseCase(repository);
const deleteUseCase = new DeleteDailySubtaskUseCase(repository);

export function DailySubtaskProvider({ children }: { children: ReactNode }) {
	const createSubtask = async (title: string, dailyId: string, order: number): Promise<DailySubtask> => {
		try {
			const taskTitle = TaskTitle.create(title);
			const result = await createUseCase.execute({ 
				title: taskTitle.getValue(), 
				dailyId, 
				order 
			});
			return result.subtask;
		} catch (error) {
			ErrorHandler.logError(error, 'DailySubtaskContext.createSubtask');
			throw new Error(ErrorHandler.handle(error));
		}
	};

	const updateSubtask = async (subtask: DailySubtask): Promise<DailySubtask> => {
		try {
			const result = await updateUseCase.execute({ subtask });
			return result.subtask;
		} catch (error) {
			ErrorHandler.logError(error, 'DailySubtaskContext.updateSubtask');
			throw new Error(ErrorHandler.handle(error));
		}
	};

	const deleteSubtask = async (id: string): Promise<void> => {
		try {
			await deleteUseCase.execute({ id });
		} catch (error) {
			ErrorHandler.logError(error, 'DailySubtaskContext.deleteSubtask');
			throw new Error(ErrorHandler.handle(error));
		}
	};

	return (
		<DailySubtaskContext.Provider value={{ createSubtask, updateSubtask, deleteSubtask }}>
			{children}
		</DailySubtaskContext.Provider>
	);
}

export function useDailySubtaskContext() {
	const context = useContext(DailySubtaskContext);
	if (!context) {
		throw new Error("useDailySubtaskContext must be used within DailySubtaskProvider");
	}
	return context;
}
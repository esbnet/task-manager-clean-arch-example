"use client";

import { createContext, useContext, type ReactNode } from "react";
import { ApiTodoSubtaskRepository } from "@/infra/repositories/backend/api-todo-subtask-repository";
import { CreateTodoSubtaskUseCase } from "@/use-cases/todo-subtask/create-todo-subtask/create-todo-subtask-use-case";
import { UpdateTodoSubtaskUseCase } from "@/use-cases/todo-subtask/update-todo-subtask/update-todo-subtask-use-case";
import { DeleteTodoSubtaskUseCase } from "@/use-cases/todo-subtask/delete-todo-subtask/delete-todo-subtask-use-case";
import { TaskTitle } from "@/domain/value-objects/task-title";
import { ErrorHandler } from "@/infra/services/error-handler";
import type { TodoSubtask } from "@/types";

interface TodoSubtaskContextType {
	createSubtask: (title: string, todoId: string, order: number) => Promise<TodoSubtask>;
	updateSubtask: (subtask: TodoSubtask) => Promise<TodoSubtask>;
	deleteSubtask: (id: string) => Promise<void>;
}

const TodoSubtaskContext = createContext<TodoSubtaskContextType | undefined>(undefined);

const repository = new ApiTodoSubtaskRepository();
const createUseCase = new CreateTodoSubtaskUseCase(repository);
const updateUseCase = new UpdateTodoSubtaskUseCase(repository);
const deleteUseCase = new DeleteTodoSubtaskUseCase(repository);

export function TodoSubtaskProvider({ children }: { children: ReactNode }) {
	const createSubtask = async (title: string, todoId: string, order: number): Promise<TodoSubtask> => {
		try {
			const taskTitle = TaskTitle.create(title);
			const result = await createUseCase.execute({ 
				title: taskTitle.getValue(), 
				todoId, 
				order 
			});
			return result.subtask;
		} catch (error) {
			ErrorHandler.logError(error, 'TodoSubtaskContext.createSubtask');
			throw new Error(ErrorHandler.handle(error));
		}
	};

	const updateSubtask = async (subtask: TodoSubtask): Promise<TodoSubtask> => {
		try {
			const result = await updateUseCase.execute({ subtask });
			return result.subtask;
		} catch (error) {
			ErrorHandler.logError(error, 'TodoSubtaskContext.updateSubtask');
			throw new Error(ErrorHandler.handle(error));
		}
	};

	const deleteSubtask = async (id: string): Promise<void> => {
		try {
			await deleteUseCase.execute({ id });
		} catch (error) {
			ErrorHandler.logError(error, 'TodoSubtaskContext.deleteSubtask');
			throw new Error(ErrorHandler.handle(error));
		}
	};

	return (
		<TodoSubtaskContext.Provider value={{ createSubtask, updateSubtask, deleteSubtask }}>
			{children}
		</TodoSubtaskContext.Provider>
	);
}

export function useTodoSubtaskContext() {
	const context = useContext(TodoSubtaskContext);
	if (!context) {
		throw new Error("useTodoSubtaskContext must be used within TodoSubtaskProvider");
	}
	return context;
}
"use client";

import {
	type ReactNode,
	createContext,
	useContext,
	useEffect,
	useState,
} from "react";

import type { Task, TaskCategory, TaskPriority } from "@/types";

import { ApiTaskRepository } from "@/infra/repositories/backend/api-task-repository";
import { CreateTaskUseCase } from "@/use-cases/task/create-task/create-task-use-case";
import { UpdateTaskUseCase } from "@/use-cases/task/update-task/update-task-use-case";

interface TaskContextType {
	tasks: Task[];
	loading: boolean;
	error: string | null;
	addTask: (
		title: string,
		category: TaskCategory,
		priority: TaskPriority,
	) => Promise<void>;
	updateTask: (task: Task) => Promise<void>;
	deleteTask: (id: string) => Promise<void>;
	toggleComplete: (id: string) => Promise<void>;
	getTask: (id: string) => Task | undefined;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

interface TaskProviderProps {
	children: ReactNode;
}

export function TaskProvider({ children }: TaskProviderProps) {
	const [tasks, setTasks] = useState<Task[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const taskRepository = new ApiTaskRepository();
	const createTaskUseCase = new CreateTaskUseCase(taskRepository);
	const updateTaskUseCase = new UpdateTaskUseCase(taskRepository);

	const fetchTasks = async () => {
		try {
			setLoading(true);
			const fetchedTasks = await taskRepository.list();
			setTasks(fetchedTasks);
			setError(null);
		} catch (err) {
			setError("Failed to fetch tasks");
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		fetchTasks();
	}, []);

	const addTask = async (
		title: string,
		category: TaskCategory,
		priority: TaskPriority,
	) => {
		try {
			const result = await createTaskUseCase.execute({
				title,
				category,
				priority,
			});
			setTasks((prevTasks) => [
				...prevTasks,
				{
					...result.task,
					category: result.task.category as TaskCategory,
					priority: result.task.priority as TaskPriority,
				},
			]);
		} catch (err) {
			setError("Failed to add task");
			console.error(err);
		}
	};

	const updateTask = async (task: Task) => {
		try {
			const updatedTask = await updateTaskUseCase.execute(task);
			setTasks((prevTasks) =>
				prevTasks.map((t) =>
					t.id === updatedTask.id ? updatedTask : t,
				),
			);
		} catch (err) {
			setError("Failed to update task");
			console.error(err);
		}
	};

	const deleteTask = async (id: string) => {
		try {
			await taskRepository.delete(id);
			setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
		} catch (err) {
			setError("Failed to delete task");
			console.error(err);
		}
	};

	const toggleComplete = async (id: string) => {
		try {
			const updatedTask = await taskRepository.toggleComplete(id);
			setTasks((prevTasks) =>
				prevTasks.map((task) => (task.id === id ? updatedTask : task)),
			);
		} catch (err) {
			setError("Falha ao completar tarefa");
			console.error(err);
		}
	};

	const getTask = (id: string) => {
		return tasks.find((task) => task.id === id);
	};

	const value = {
		tasks,
		loading,
		error,
		addTask,
		updateTask,
		deleteTask,
		toggleComplete,
		getTask,
	};

	return (
		<TaskContext.Provider value={value}>{children}</TaskContext.Provider>
	);
}

// Custom hook to use the TaskContext
export function useTaskContext() {
	const context = useContext(TaskContext);
	if (context === undefined) {
		throw new Error("useTaskContext must be used within a TaskProvider");
	}
	return context;
}

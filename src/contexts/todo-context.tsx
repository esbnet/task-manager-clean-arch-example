"use client";

import {
	type ReactNode,
	createContext,
	useContext,
	useEffect,
	useState,
} from "react";

import type { Todo } from "@/types";

import { ApiTodoRepository } from "@/infra/repositories/backend/api-todo-repository";
import { CreateTodoUseCase } from "@/use-cases/todo/create-todo/create-todo-use-case";
import { UpdateTodoUseCase } from "@/use-cases/todo/update-todo/update-todo-use-case";

interface TodoContextType {
	todos: Todo[];
	loading: boolean;
	error: string | null;
	addTodo: (todo: Omit<Todo, "id" | "createdAt">
	) => Promise<void>,
	updateTodo: (todo: Todo) => Promise<void>;
	deleteTodo: (id: string) => Promise<void>;
	toggleComplete: (id: string) => Promise<void>;
	getTodo: (id: string) => Todo | undefined;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

interface TodoProviderProps {
	children: ReactNode;
}

export function TodoProvider({ children }: TodoProviderProps) {
	const [todos, setTodos] = useState<Todo[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const todoRepository = new ApiTodoRepository();
	const createTodoUseCase = new CreateTodoUseCase(todoRepository);
	const updateTodoUseCase = new UpdateTodoUseCase(todoRepository);

	const fetchTodos = async () => {
		try {
			setLoading(true);
			const fetchedTodos = await todoRepository.list();
			setTodos(fetchedTodos as Todo[]);
			setError(null);
		} catch (err) {
			setError("Failed to fetch todos");
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		fetchTodos();
	}, []);

	const addTodo = async (todo: Omit<Todo, "id" | "createdAt">) => {
		try {
			const result = await createTodoUseCase.execute({
				title: todo.title,
				observations: todo.observations || "",
				tasks: todo.tasks || [] as string[],
				difficulty: todo.difficulty || "Fácil",
				startDate: todo.startDate || new Date(),
				tags: todo.tags || [],
				createdAt: new Date(),
			});
			setTodos((prevTodos) => [
				...prevTodos,
				result.todo as Todo,
			]);
		} catch (err) {
			setError("Failed to add todo");
			console.error(err);
		}
	};

	const updateTodo = async (todo: Todo) => {
		try {
			const updatedTodoOutput = await updateTodoUseCase.execute(todo); // returns UpdateTodoOutput
			const updatedTodo: Todo = {
				...todo,
				...updatedTodoOutput,
			};
			setTodos((prevTodos) =>
				prevTodos.map((t) =>
					t.id === updatedTodo.id ? updatedTodo : t,
				),
			);
		} catch (err) {
			setError("Failed to update todo");
			console.error(err);
		}
	};

	const deleteTodo = async (id: string) => {
		try {
			await todoRepository.delete(id);
			setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
		} catch (err) {
			setError("Failed to delete todo");
			console.error(err);
		}
	};

	const toggleComplete = async (id: string) => {
		try {
			const updatedTodoFromRepo = await todoRepository.toggleComplete(id);


			const updatedTodo: Todo = {
				...updatedTodoFromRepo,
			} as Todo;

			setTodos((prevTodos) =>
				prevTodos.map((todo) => (todo.id === id ? updatedTodo : todo)),
			);
		} catch (err) {
			setError("Falha ao completar tarefa");
			console.error(err);
		}
	};

	const getTodo = (id: string) => {
		return todos.find((todo) => todo.id === id);
	};

	const value = {
		todos,
		loading,
		error,
		addTodo,
		updateTodo,
		deleteTodo,
		toggleComplete,
		getTodo,
	};

	return (
		<TodoContext.Provider value={value}>{children}</TodoContext.Provider>
	);
}

// Custom hook to use the TodoContext
export function useTodoContext() {
	const context = useContext(TodoContext);
	if (context === undefined) {
		throw new Error("useTodoContext must be used within a TodoProvider");
	}
	return context;
}

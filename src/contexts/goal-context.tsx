"use client";

import type { Goal } from "@/domain/entities/goal";
import {
	type ReactNode,
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";

interface GoalFormData {
	title: string;
	description: string;
	targetDate: Date;
	priority: Goal["priority"];
	category: Goal["category"];
	tags: string[];
}

interface GoalContextType {
	goals: Goal[];
	loading: boolean;
	error: string | null;
	createGoal: (data: GoalFormData) => Promise<void>;
	updateGoal: (id: string, data: Partial<Goal>) => Promise<void>;
	deleteGoal: (id: string) => Promise<void>;
	refreshGoals: () => Promise<void>;
}

const GoalContext = createContext<GoalContextType | undefined>(undefined);

interface GoalProviderProps {
	children: ReactNode;
}

export function GoalProvider({ children }: GoalProviderProps) {
	const [goals, setGoals] = useState<Goal[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchGoals = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);

			// TODO: Implementar chamada real para a API
			// Por enquanto, vamos usar dados mockados
			const mockGoals: Goal[] = [
				{
					id: "1",
					title: "Aprender React Avançado",
					description:
						"Dominar hooks avançados, context API e performance",
					targetDate: new Date("2024-12-31"),
					status: "IN_PROGRESS",
					priority: "HIGH",
					category: "LEARNING",
					tags: ["react", "frontend", "javascript"],
					userId: "user1",
					createdAt: new Date("2024-01-01"),
					updatedAt: new Date("2024-01-01"),
				},
				{
					id: "2",
					title: "Correr 5km",
					description: "Treinar para completar uma corrida de 5km",
					targetDate: new Date("2024-06-30"),
					status: "IN_PROGRESS",
					priority: "MEDIUM",
					category: "HEALTH",
					tags: ["corrida", "saúde", "fitness"],
					userId: "user1",
					createdAt: new Date("2024-01-01"),
					updatedAt: new Date("2024-01-01"),
				},
				{
					id: "3",
					title: "Ler 12 livros este ano",
					description: "Ler pelo menos um livro por mês",
					targetDate: new Date("2024-12-31"),
					status: "IN_PROGRESS",
					priority: "LOW",
					category: "PERSONAL",
					tags: ["leitura", "desenvolvimento pessoal"],
					userId: "user1",
					createdAt: new Date("2024-01-01"),
					updatedAt: new Date("2024-01-01"),
				},
			];

			setGoals(mockGoals);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Erro ao carregar metas",
			);
		} finally {
			setLoading(false);
		}
	}, []);

	const createGoal = async (data: GoalFormData) => {
		try {
			setError(null);

			// TODO: Implementar chamada real para a API
			const newGoal: Goal = {
				id: Date.now().toString(),
				...data,
				status: "IN_PROGRESS",
				userId: "user1", // TODO: Pegar do contexto de autenticação
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			setGoals((prev) => [newGoal, ...prev]);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Erro ao criar meta");
			throw err;
		}
	};

	const updateGoal = async (id: string, data: Partial<Goal>) => {
		try {
			setError(null);

			// TODO: Implementar chamada real para a API
			setGoals((prev) =>
				prev.map((goal) =>
					goal.id === id
						? { ...goal, ...data, updatedAt: new Date() }
						: goal,
				),
			);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Erro ao atualizar meta",
			);
			throw err;
		}
	};

	const deleteGoal = async (id: string) => {
		try {
			setError(null);

			// TODO: Implementar chamada real para a API
			setGoals((prev) => prev.filter((goal) => goal.id !== id));
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Erro ao excluir meta",
			);
			throw err;
		}
	};

	const refreshGoals = async () => {
		await fetchGoals();
	};

	useEffect(() => {
		fetchGoals();
	}, [fetchGoals]);

	const value: GoalContextType = {
		goals,
		loading,
		error,
		createGoal,
		updateGoal,
		deleteGoal,
		refreshGoals,
	};

	return (
		<GoalContext.Provider value={value}>{children}</GoalContext.Provider>
	);
}

export function useGoals(): GoalContextType {
	const context = useContext(GoalContext);
	if (context === undefined) {
		throw new Error("useGoals deve ser usado dentro de um GoalProvider");
	}
	return context;
}

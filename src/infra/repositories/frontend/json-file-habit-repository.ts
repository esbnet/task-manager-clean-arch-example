import fs from "node:fs";
import path from "node:path";
import type { Habit } from "@/domain/entities/habit";
import type { HabitRepository } from "@/domain/repositories/all-repository";

let habits: Habit[] = [];
const dataPath = path.join(process.cwd(), "src", "data", "habits.json");

export class InJsonFileHabitRepository implements HabitRepository {
	async list(): Promise<Habit[]> {
		const data = fs.readFileSync(dataPath, "utf-8");
		const parsedData = JSON.parse(data);
		const habits = parsedData.habits || [];

		return [...habits];
	}

	async create(data: Omit<Habit, "id" | "createdAt">): Promise<Habit> {
		// Verifica se o diretório existe
		const dirPath = path.dirname(dataPath);
		if (!fs.existsSync(dirPath)) {
			fs.mkdirSync(dirPath, { recursive: true });
		}

		// Lê os dados existentes ou inicializa um array vazio
		if (fs.existsSync(dataPath)) {
			const fileData = fs.readFileSync(dataPath);
			habits = JSON.parse(fileData.toString()).habits || [];
		}

		const newHabit: Habit = {
			id: Math.random().toString(36).substring(7),
			...data,
			createdAt: new Date(),
		};

		habits.push(newHabit);

		// Escreve de volta no arquivo
		fs.writeFileSync(dataPath, JSON.stringify({ habits }, null, 2));

		return newHabit;
	}

	async toggleComplete(id: string): Promise<Habit> {
		// Verifica se o arquivo existe
		if (!fs.existsSync(dataPath)) {
			throw new Error(`File not found: ${dataPath}`);
		}

		// Lê os dados existentes ou inicializa um array vazio
		if (!fs.existsSync(dataPath)) {
			fs.writeFileSync(dataPath, JSON.stringify({ habits: [] }, null, 2));
		}

		// Lê os dados existentes
		const fileData = fs.readFileSync(dataPath);
		habits = JSON.parse(fileData.toString()).habits || [];

		// Verifica se a tarefa existe no array
		const habitIndex = habits.findIndex((t) => t.id === id);
		if (habitIndex < 0) throw new Error("Habit not found");

		const habit = habits[habitIndex];
		// habit.completed = !habit.completed; //TODO: Implementar lógica de toggle completo

		habits[habitIndex] = habit;

		// Escreve de volta no arquivo
		fs.writeFileSync(dataPath, JSON.stringify({ habits }, null, 2));

		return habit;
	}

	async update(habit: Habit): Promise<Habit> {
		// Verifica se o arquivo existe
		if (!fs.existsSync(dataPath)) {
			throw new Error(`File not found: ${dataPath}`);
		}

		// Lê os dados existentes
		const fileData = fs.readFileSync(dataPath);
		habits = JSON.parse(fileData.toString()).habits || [];

		// Verifica se a tarefa existe no array
		const habitIndex = habits.findIndex((t) => t.id === habit.id);
		if (habitIndex < 0) throw new Error("Habit not found");

		// Atualiza a tarefa
		habits[habitIndex] = { ...habits[habitIndex], ...habit };

		// Escreve de volta no arquivo
		fs.writeFileSync(dataPath, JSON.stringify({ habits }, null, 2));

		return habits[habitIndex];
	}

	async delete(id: string): Promise<void> {
		// Verifica se o arquivo existe
		if (!fs.existsSync(dataPath)) {
			throw new Error(`File not found: ${dataPath}`);
		}

		// Lê os dados existentes
		const fileData = fs.readFileSync(dataPath);
		habits = JSON.parse(fileData.toString()).habits || [];

		// Verifica se a tarefa existe no array
		const habitIndex = habits.findIndex((t) => t.id === id);
		if (habitIndex < 0) throw new Error("Habit not found");

		// Remove o usuário pelo índice
		habits.splice(habitIndex, 1);

		// Salva de volta no arquivo
		fs.writeFileSync(dataPath, JSON.stringify({ habits }, null, 2));

		// Atualiza o array em memória
		habits = habits.filter((t) => t.id !== id);

		return;
	}
}

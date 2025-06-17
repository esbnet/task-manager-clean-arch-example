import fs from "node:fs";
import path from "node:path";
import type { Task } from "@/domain/entities/task";
import type { TaskRepository } from "@/domain/repositories/task-repository";

let tasks: Task[] = [];
const dataPath = path.join(process.cwd(), "data", "tasks.json");

export class InJsonFileTaskRepository implements TaskRepository {
	async list(): Promise<Task[]> {
		const data = fs.readFileSync(dataPath, "utf-8");
		const parsedData = JSON.parse(data);
		const tasks = parsedData.tasks || [];

		return [...tasks];
	}

	async create(data: Omit<Task, "id" | "createdAt">): Promise<Task> {
		// Verifica se o diretório existe
		const dirPath = path.dirname(dataPath);
		if (!fs.existsSync(dirPath)) {
			fs.mkdirSync(dirPath, { recursive: true });
		}

		// Lê os dados existentes ou inicializa um array vazio
		if (fs.existsSync(dataPath)) {
			const fileData = fs.readFileSync(dataPath);
			tasks = JSON.parse(fileData.toString()).tasks || [];
		}

		const newTask: Task = {
			id: Math.random().toString(36).substring(7),
			...data,
			createdAt: new Date(),
		};

		tasks.push(newTask);

		// Escreve de volta no arquivo
		fs.writeFileSync(dataPath, JSON.stringify({ tasks }, null, 2));

		return newTask;
	}

	async toggleComplete(id: string): Promise<Task> {
		// Verifica se o arquivo existe
		if (!fs.existsSync(dataPath)) {
			throw new Error(`File not found: ${dataPath}`);
		}

		// Lê os dados existentes ou inicializa um array vazio
		if (!fs.existsSync(dataPath)) {
			fs.writeFileSync(dataPath, JSON.stringify({ tasks: [] }, null, 2));
		}

		// Lê os dados existentes
		const fileData = fs.readFileSync(dataPath);
		tasks = JSON.parse(fileData.toString()).tasks || [];

		// Verifica se a tarefa existe no array
		const taskIndex = tasks.findIndex((t) => t.id === id);
		if (taskIndex < 0) throw new Error("Task not found");

		const task = tasks[taskIndex];
		task.completed = !task.completed;

		tasks[taskIndex] = task;

		// Escreve de volta no arquivo
		fs.writeFileSync(dataPath, JSON.stringify({ tasks }, null, 2));

		return task;
	}

	async update(task: Task): Promise<Task> {
		// Verifica se o arquivo existe
		if (!fs.existsSync(dataPath)) {
			throw new Error(`File not found: ${dataPath}`);
		}

		// Lê os dados existentes
		const fileData = fs.readFileSync(dataPath);
		tasks = JSON.parse(fileData.toString()).tasks || [];

		// Verifica se a tarefa existe no array
		const taskIndex = tasks.findIndex((t) => t.id === task.id);
		if (taskIndex < 0) throw new Error("Task not found");

		// Atualiza a tarefa
		tasks[taskIndex] = { ...tasks[taskIndex], ...task };

		// Escreve de volta no arquivo
		fs.writeFileSync(dataPath, JSON.stringify({ tasks }, null, 2));

		return tasks[taskIndex];
	}

	async delete(id: string): Promise<void> {
		// Verifica se o arquivo existe
		if (!fs.existsSync(dataPath)) {
			throw new Error(`File not found: ${dataPath}`);
		}

		// Lê os dados existentes
		const fileData = fs.readFileSync(dataPath);
		tasks = JSON.parse(fileData.toString()).tasks || [];

		// Verifica se a tarefa existe no array
		const taskIndex = tasks.findIndex((t) => t.id === id);
		if (taskIndex < 0) throw new Error("Task not found");

		// Remove o usuário pelo índice
		tasks.splice(taskIndex, 1);

		// Salva de volta no arquivo
		fs.writeFileSync(dataPath, JSON.stringify({ tasks }, null, 2));

		// Atualiza o array em memória
		tasks = tasks.filter((t) => t.id !== id);

		return;
	}
}

import fs from "node:fs";
import path from "node:path";
import type { Todo } from "@/domain/entities/todo";
import type { TodoRepository } from "@/domain/repositories/all-repository";

let todos: Todo[] = [];
const dataPath = path.join(process.cwd(), "src", "data", "todos.json");

export class InJsonFileTodoRepository implements TodoRepository {
	async list(): Promise<Todo[]> {
		const data = fs.readFileSync(dataPath, "utf-8");
		const parsedData = JSON.parse(data);
		const todos = parsedData.todos || [];

		return [...todos];
	}

	async create(data: Omit<Todo, "id" | "createdAt">): Promise<Todo> {
		// Verifica se o diretório existe
		const dirPath = path.dirname(dataPath);
		if (!fs.existsSync(dirPath)) {
			fs.mkdirSync(dirPath, { recursive: true });
		}

		// Lê os dados existentes ou inicializa um array vazio
		if (fs.existsSync(dataPath)) {
			const fileData = fs.readFileSync(dataPath);
			todos = JSON.parse(fileData.toString()).todos || [];
		}

		const newTodo: Todo = {
			id: Math.random().toString(36).substring(7),
			...data,
			createdAt: new Date(),
		};

		todos.push(newTodo);

		// Escreve de volta no arquivo
		fs.writeFileSync(dataPath, JSON.stringify({ todos }, null, 2));

		return newTodo;
	}

	async toggleComplete(id: string): Promise<Todo> {
		// Verifica se o arquivo existe
		if (!fs.existsSync(dataPath)) {
			throw new Error(`File not found: ${dataPath}`);
		}

		// Lê os dados existentes ou inicializa um array vazio
		if (!fs.existsSync(dataPath)) {
			fs.writeFileSync(dataPath, JSON.stringify({ todos: [] }, null, 2));
		}

		// Lê os dados existentes
		const fileData = fs.readFileSync(dataPath);
		todos = JSON.parse(fileData.toString()).todos || [];

		// Verifica se a tarefa existe no array
		const todoIndex = todos.findIndex((t) => t.id === id);
		if (todoIndex < 0) throw new Error("Todo not found");

		const todo = todos[todoIndex];
		// todo.completed = !todo.completed; //TODO: Implementar lógica de toggle completo

		todos[todoIndex] = todo;

		// Escreve de volta no arquivo
		fs.writeFileSync(dataPath, JSON.stringify({ todos }, null, 2));

		return todo;
	}

	async update(todo: Todo): Promise<Todo> {
		// Verifica se o arquivo existe
		if (!fs.existsSync(dataPath)) {
			throw new Error(`File not found: ${dataPath}`);
		}

		// Lê os dados existentes
		const fileData = fs.readFileSync(dataPath);
		todos = JSON.parse(fileData.toString()).todos || [];

		// Verifica se a tarefa existe no array
		const todoIndex = todos.findIndex((t) => t.id === todo.id);
		if (todoIndex < 0) throw new Error("Todo not found");

		// Atualiza a tarefa
		todos[todoIndex] = { ...todos[todoIndex], ...todo };

		// Escreve de volta no arquivo
		fs.writeFileSync(dataPath, JSON.stringify({ todos }, null, 2));

		return todos[todoIndex];
	}

	async delete(id: string): Promise<void> {
		// Verifica se o arquivo existe
		if (!fs.existsSync(dataPath)) {
			throw new Error(`File not found: ${dataPath}`);
		}

		// Lê os dados existentes
		const fileData = fs.readFileSync(dataPath);
		todos = JSON.parse(fileData.toString()).todos || [];

		// Verifica se a tarefa existe no array
		const todoIndex = todos.findIndex((t) => t.id === id);
		if (todoIndex < 0) throw new Error("Todo not found");

		// Remove o usuário pelo índice
		todos.splice(todoIndex, 1);

		// Salva de volta no arquivo
		fs.writeFileSync(dataPath, JSON.stringify({ todos }, null, 2));

		// Atualiza o array em memória
		todos = todos.filter((t) => t.id !== id);

		return;
	}
}

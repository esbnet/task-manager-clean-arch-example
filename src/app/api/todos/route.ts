import { PrismaTodoRepository } from "@/infra/repositories/database/prisma-todo-repository";
import { CreateTodoUseCase } from "@/use-cases/todo/create-todo/create-todo-use-case";
import { DeleteTodoUseCase } from "@/use-cases/todo/delete-todo/toggle-delete-use-case";
import { ListTodosUseCase } from "@/use-cases/todo/list-todo/list-todo-use-case";
import { UpdateTodoUseCase } from "@/use-cases/todo/update-todo/update-todo-use-case";
import type { NextRequest } from "next/server";

// Instância única do repositório
// const todoRepo = new InJsonFileTodoRepository();
const todoRepo = new PrismaTodoRepository();

export async function GET() {
	const useCase = new ListTodosUseCase(todoRepo);
	const result = await useCase.execute();
	return Response.json(result);
}

export async function POST(request: NextRequest) {
	const { title, observations, tasks, difficulty, startDate, tags } =
		await request.json();
	const useCase = new CreateTodoUseCase(todoRepo);
	const result = await useCase.execute({
		title: title,
		observations: observations || "",
		tasks: tasks || ([] as string[]),
		difficulty: difficulty || "Fácil",
		startDate: startDate || new Date(),
		tags: tags || ([] as string[]),
		createdAt: new Date(),
	});
	return Response.json(result, { status: 201 });
}

// export async function PUT(request: NextRequest) {
// 	const { id } = await request.json();
// 	const useCase = new ToggleCompleteUseCase(todoRepo);
// 	await useCase.execute(id);
// 	return new Response(null, { status: 204 });
// }

export async function PATCH(request: NextRequest) {
	const { todo } = await request.json();
	const useCase = new UpdateTodoUseCase(todoRepo);
	const updatedTodo = await useCase.execute(todo);
	return Response.json({ todo: updatedTodo }, { status: 200 });
}

export async function DELETE(request: NextRequest) {
	const { id } = await request.json();
	const useCase = new DeleteTodoUseCase(todoRepo);
	await useCase.execute(id);
	return new Response(null, { status: 204 });
}

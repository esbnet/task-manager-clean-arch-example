import { InMemoryTaskRepository } from "@/infra/repositories/in-memory-task-repository";
import { CreateTaskUseCase } from "@/use-cases/create-task/create-task-use-case";
import { DeleteTaskUseCase } from "@/use-cases/delete-task/toggle-delete-use-case";
import { ListTasksUseCase } from "@/use-cases/list-tasks/list-task-use-case";
import { ToggleCompleteUseCase } from "@/use-cases/toggle-complete-task/toggle-complete-use-case";
import type { NextRequest } from "next/server";

// Instância única do repositório
const taskRepo = new InMemoryTaskRepository();

export async function GET() {
	const useCase = new ListTasksUseCase(taskRepo);
	const result = await useCase.execute();
	return Response.json(result);
}

export async function POST(request: NextRequest) {
	const { title, category, priority } = await request.json();
	const useCase = new CreateTaskUseCase(taskRepo);
	const result = await useCase.execute({ title, category , priority  });
	return Response.json(result, { status: 201 });
}

export async function PATCH(request: NextRequest) {
	const { id } = await request.json();
	const useCase = new ToggleCompleteUseCase(taskRepo);
	await useCase.execute(id);
	return new Response(null, { status: 204 });
}

export async function DELETE(request: NextRequest) {
	const { id } = await request.json();
	const useCase = new DeleteTaskUseCase(taskRepo);
	await useCase.execute(id);
	return new Response(null, { status: 204 });
}

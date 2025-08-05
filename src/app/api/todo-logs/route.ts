import { PrismaTodoLogRepository } from "@/infra/repositories/database/prisma-todo-log-repository";
import { CompleteTodoUseCase } from "@/use-cases/todo/complete-todo/complete-todo-use-case";
import type { NextRequest } from "next/server";

// const todoLogRepository = new InJsonFileTodoLogRepository();
const todoLogRepository = new PrismaTodoLogRepository();

export async function POST(request: NextRequest) {
	const { todo } = await request.json();
	const useCase = new CompleteTodoUseCase(todoLogRepository);
	const result = await useCase.execute({ todo });
	return Response.json(result, { status: 201 });
}

export async function GET() {
	const logs = await todoLogRepository.list();
	return Response.json({ todoLogs: logs });
}
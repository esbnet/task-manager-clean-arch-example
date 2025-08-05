import { PrismaHabitLogRepository } from "@/infra/repositories/database/prisma-habit-log-repository";
import { CompleteHabitUseCase } from "@/use-cases/habit/complete-habit/complete-habit-use-case";
import type { NextRequest } from "next/server";

// const habitLogRepository = new InJsonFileHabitLogRepository();
const habitLogRepository = new PrismaHabitLogRepository();

export async function POST(request: NextRequest) {
	const { habit } = await request.json();
	const useCase = new CompleteHabitUseCase(habitLogRepository);
	const result = await useCase.execute({ habit });
	return Response.json(result, { status: 201 });
}

export async function GET() {
	const logs = await habitLogRepository.list();
	return Response.json({ habitLogs: logs });
}
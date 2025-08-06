import { PrismaDailyLogRepository } from "@/infra/repositories/database/prisma-daily-log-repository";
import { CompleteDailyUseCase } from "@/use-cases/daily/complete-daily/complete-daily-use-case";
import type { NextRequest } from "next/server";

// const dailyLogRepository = new InJsonFileDailyLogRepository();
const dailyLogRepository = new PrismaDailyLogRepository();
export async function POST(request: NextRequest) {
	const { daily } = await request.json();
	const useCase = new CompleteDailyUseCase(dailyLogRepository);
	const result = await useCase.execute({ daily });
	return Response.json(result, { status: 201 });
}

export async function GET() {
	const logs = await dailyLogRepository.list();
	return Response.json({ dailyLogs: logs });
}

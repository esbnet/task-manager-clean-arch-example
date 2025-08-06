import { PrismaDailyRepository } from "@/infra/repositories/database/prisma-daily-repository";
import { CreateDailyUseCase } from "@/use-cases/daily/create-daily/create-daily-use-case";
import { DeleteDailyUseCase } from "@/use-cases/daily/delete-daily/toggle-delete-use-case";
import { ListDailyUseCase } from "@/use-cases/daily/list-daily/list-daily-use-case";
import { UpdateDailyUseCase } from "@/use-cases/daily/update-daily/update-daily-use-case";
import type { NextRequest } from "next/server";

// Instância única do repositório
// const dailyRepo = new InJsonFileDailyRepository();
const dailyRepo = new PrismaDailyRepository();

export async function GET() {
	const useCase = new ListDailyUseCase(dailyRepo);
	const result = await useCase.execute();
	return Response.json(result);
}

export async function POST(request: NextRequest) {
	const { title, observations, tasks, difficulty, repeat, tags } =
		await request.json();
	const useCase = new CreateDailyUseCase(dailyRepo);
	const result = await useCase.execute({
		title: title,
		observations: observations || "", // Default value
		tasks: tasks || [], // Default value
		difficulty: difficulty || "Fácil", // Default value
		startDate: new Date(),
		repeat: {
			type: repeat.type || "Diária",
			frequency: 1, // Default value
		},
		tags: tags || [], // Default value
		createdAt: new Date(),
	});
	return Response.json(result, { status: 201 });
}

// export async function PUT(request: NextRequest) {
// 	const { id } = await request.json();
// 	const useCase = new ToggleCompleteUseCase(dailyRepo);
// 	await useCase.execute(id);
// 	return new Response(null, { status: 204 });
// }

export async function PATCH(request: NextRequest) {
	const { daily } = await request.json();
	const useCase = new UpdateDailyUseCase(dailyRepo);
	const updatedDaily = await useCase.execute(daily);
	return Response.json({ daily: updatedDaily }, { status: 200 });
}

export async function DELETE(request: NextRequest) {
	const { id } = await request.json();
	const useCase = new DeleteDailyUseCase(dailyRepo);
	await useCase.execute(id);
	return new Response(null, { status: 204 });
}

import { InJsonFileHabitRepository } from "@/infra/repositories/frontend/json-file-habit-repository";
import { CreateHabitUseCase } from "@/use-cases/habit/create-habit/create-habit-use-case";
import { DeleteHabitUseCase } from "@/use-cases/habit/delete-habit/toggle-delete-use-case";
import { ListHabitsUseCase } from "@/use-cases/habit/list-habit/list-task-use-case";
import { ToggleCompleteUseCase } from "@/use-cases/habit/toggle-complete-habit/toggle-complete-use-case";
import { UpdateHabitUseCase } from "@/use-cases/habit/update-habit/update-habit-use-case";
import type { NextRequest } from "next/server";

// Instância única do repositório
const habitRepository = new InJsonFileHabitRepository();

export async function GET() {
	const useCase = new ListHabitsUseCase(habitRepository);
	const result = await useCase.execute();
	return Response.json(result);
}

export async function POST(request: NextRequest) {
	const { title, observations, difficulty, tags, reset, createdAt } =
		await request.json();
	const useCase = new CreateHabitUseCase(habitRepository);
	const result = await useCase.execute({
		title,
		observations,
		difficulty,
		tags,
		reset,
		createdAt,
	});
	return Response.json(result, { status: 201 });
}

export async function PUT(request: NextRequest) {
	const { id } = await request.json();
	const useCase = new ToggleCompleteUseCase(habitRepository);
	await useCase.execute(id);
	return new Response(null, { status: 204 });
}

export async function PATCH(request: NextRequest) {
	const { habit } = await request.json();
	const useCase = new UpdateHabitUseCase(habitRepository);
	const updatedHabit = await useCase.execute(habit);
	return Response.json({ habit: updatedHabit }, { status: 200 });
}

export async function DELETE(request: NextRequest) {
	const { id } = await request.json();
	const useCase = new DeleteHabitUseCase(habitRepository);
	await useCase.execute(id);
	return new Response(null, { status: 204 });
}

import { PrismaDailySubtaskRepository } from "@/infra/repositories/database/prisma-daily-subtask-repository";
import type { NextRequest } from "next/server";

const subtaskRepo = new PrismaDailySubtaskRepository();

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const dailyId = searchParams.get('dailyId');
	
	if (dailyId) {
		const subtasks = await subtaskRepo.listByDailyId(dailyId);
		return Response.json({ subtasks });
	}
	
	const subtasks = await subtaskRepo.list();
	return Response.json({ subtasks });
}

export async function POST(request: NextRequest) {
	try {
		const { title, dailyId, order } = await request.json();
		const subtask = await subtaskRepo.create({
			title,
			completed: false,
			dailyId,
			order: order ?? 0
		});
		return Response.json({ subtask }, { status: 201 });
	} catch (error) {
		console.error('Error creating subtask:', error);
		return Response.json({ error: 'Failed to create subtask' }, { status: 500 });
	}
}

export async function PATCH(request: NextRequest) {
	const { subtask } = await request.json();
	const updated = await subtaskRepo.update(subtask);
	return Response.json({ subtask: updated });
}

export async function DELETE(request: NextRequest) {
	const { id } = await request.json();
	await subtaskRepo.delete(id);
	return new Response(null, { status: 204 });
}
import { PrismaTodoSubtaskRepository } from "@/infra/repositories/database/prisma-todo-subtask-repository";
import type { NextRequest } from "next/server";

const subtaskRepo = new PrismaTodoSubtaskRepository();

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const todoId = searchParams.get("todoId");

		if (todoId) {
			const subtasks = await subtaskRepo.listByTodoId(todoId);
			return Response.json({ subtasks });
		}

		const subtasks = await subtaskRepo.list();
		return Response.json({ subtasks });
	} catch (error) {
		console.error("Error in GET /api/todo-subtasks:", error);
		return Response.json(
			{ error: "Failed to fetch subtasks", subtasks: [] },
			{ status: 500 },
		);
	}
}

export async function POST(request: NextRequest) {
	try {
		const { title, todoId, order } = await request.json();
		const subtask = await subtaskRepo.create({
			title,
			completed: false,
			todoId,
			order: order ?? 0,
		});
		return Response.json({ subtask }, { status: 201 });
	} catch (error) {
		console.error("Error creating subtask:", error);
		return Response.json(
			{ error: "Failed to create subtask" },
			{ status: 500 },
		);
	}
}

export async function PATCH(request: NextRequest) {
	const { subtask } = await request.json();
	const updated = await subtaskRepo.update(subtask);
	return Response.json({ subtask: updated });
}

export async function DELETE(request: NextRequest) {
	const url = new URL(request.url);
	const id = url.searchParams.get('id');
	
	if (!id) {
		return Response.json({ error: 'ID is required' }, { status: 400 });
	}
	
	await subtaskRepo.delete(id);
	return new Response(null, { status: 204 });
}

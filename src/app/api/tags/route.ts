import { PrismaTagRepository } from "@/infra/repositories/database/prisma-tag-repository";
import type { NextRequest } from "next/server";

const tagRepo = new PrismaTagRepository();

export async function GET() {
	const tags = await tagRepo.list();
	return Response.json({ tags });
}

export async function POST(request: NextRequest) {
	const { name, color } = await request.json();
	const tag = await tagRepo.create({
		name,
		color: color || "#3b82f6",
	});
	return Response.json({ tag }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
	const { tag } = await request.json();
	const updated = await tagRepo.update(tag);
	return Response.json({ tag: updated });
}

export async function DELETE(request: NextRequest) {
	const { id } = await request.json();
	await tagRepo.delete(id);
	return new Response(null, { status: 204 });
}

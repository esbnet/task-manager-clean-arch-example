import type { Tag } from "@/domain/entities/tag";
import type { TagRepository } from "@/domain/repositories/all-repository";
import { prisma } from "@/infra/database/prisma-client";

export class PrismaTagRepository implements TagRepository {
	async list(): Promise<Tag[]> {
		const tags = await prisma.tag.findMany({
			orderBy: { name: "asc" },
		});
		return tags.map(this.toDomain);
	}

	async create(data: Omit<Tag, "id" | "createdAt">): Promise<Tag> {
		const tag = await prisma.tag.create({
			data: {
				name: data.name,
				color: data.color,
			},
		});
		return this.toDomain(tag);
	}

	async update(tag: Tag): Promise<Tag> {
		const updated = await prisma.tag.update({
			where: { id: tag.id },
			data: {
				name: tag.name,
				color: tag.color,
			},
		});
		return this.toDomain(updated);
	}

	async toggleComplete(id: string): Promise<Tag> {
		throw new Error("Toggle complete not implemented for tags");
	}

	async delete(id: string): Promise<void> {
		await prisma.tag.delete({ where: { id } });
	}

	private toDomain(tag: any): Tag {
		return {
			id: tag.id,
			name: tag.name,
			color: tag.color,
			createdAt: tag.createdAt,
		};
	}
}

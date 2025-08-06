import type { Tag } from "@/domain/entities/tag";
import type { TagRepository } from "@/domain/repositories/all-repository";
import { prisma } from "@/infra/database/prisma-client";

export class PrismaTagRepository implements TagRepository {
	async list(): Promise<Tag[]> {
		try {
			const tags = await prisma.tag.findMany({
				orderBy: { name: "asc" },
			});
			
			// Se não há tags, criar algumas padrão baseadas nas tarefas existentes
			if (tags.length === 0) {
				// Buscar tags únicas das tarefas existentes
				const [todos, dailies, habits] = await Promise.all([
					prisma.todo.findMany({ select: { tags: true } }),
					prisma.daily.findMany({ select: { tags: true } }),
					prisma.habit.findMany({ select: { tags: true } })
				]);
				
				const allTags = new Set<string>();
				[...todos, ...dailies, ...habits].forEach(item => {
					if (Array.isArray(item.tags)) {
						item.tags.forEach(tag => allTags.add(tag));
					}
				});
				
				const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];
				let colorIndex = 0;
				
				for (const tagName of allTags) {
					await prisma.tag.create({ 
						data: { 
							name: tagName, 
							color: colors[colorIndex % colors.length] 
						} 
					});
					colorIndex++;
				}
				
				// Se ainda não há tags, criar algumas padrão
				if (allTags.size === 0) {
					const defaultTags = [
						{ name: "Trabalho", color: "#3b82f6" },
						{ name: "Estudo", color: "#10b981" },
						{ name: "Pessoal", color: "#f59e0b" },
					];
					
					for (const tag of defaultTags) {
						await prisma.tag.create({ data: tag });
					}
				}
				
				const newTags = await prisma.tag.findMany({
					orderBy: { name: "asc" },
				});
				return newTags.map(this.toDomain);
			}
			
			return tags.map(this.toDomain);
		} catch (error) {
			console.error('Error listing tags:', error);
			return [];
		}
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

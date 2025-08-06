import type { TagRepository } from "@/domain/repositories/all-repository";
import type { Tag } from "@/domain/entities/tag";

export interface ListTagOutput {
	tags: Tag[];
}

export class ListTagUseCase {
	constructor(private tagRepository: TagRepository) {}

	async execute(): Promise<ListTagOutput> {
		const tags = await this.tagRepository.list();
		return { tags };
	}
}
import type { TagRepository } from "@/domain/repositories/all-repository";
import type { Tag } from "@/domain/entities/tag";

export interface UpdateTagInput {
	tag: Tag;
}

export interface UpdateTagOutput {
	tag: Tag;
}

export class UpdateTagUseCase {
	constructor(private tagRepository: TagRepository) {}

	async execute(input: UpdateTagInput): Promise<UpdateTagOutput> {
		const tag = await this.tagRepository.update(input.tag);
		return { tag };
	}
}
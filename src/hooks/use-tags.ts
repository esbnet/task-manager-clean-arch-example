import { useTagsContext } from "@/contexts/tags-context";

export function useTags() {
	const { tags, tagOptions, isLoading, refetch, createTag, updateTag, deleteTag } = useTagsContext();

	const getTagColor = (tagName: string) =>
		tags.find((t) => t.name === tagName)?.color;

	return { 
		tags, 
		tagOptions, 
		isLoading, 
		refetch, 
		getTagColor,
		createTag,
		updateTag,
		deleteTag
	};
}

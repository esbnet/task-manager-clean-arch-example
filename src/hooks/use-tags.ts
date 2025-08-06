import { useTagsContext } from "@/contexts/tags-context";

export function useTags() {
	const { tags, tagOptions, isLoading, refetch } = useTagsContext();

	const getTagColor = (tagName: string) =>
		tags.find((t) => t.name === tagName)?.color;

	return { tags, tagOptions, isLoading, refetch, getTagColor };
}

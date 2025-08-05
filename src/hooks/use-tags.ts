import { useState, useEffect } from "react";
import type { Tag } from "@/types";

export function useTags() {
	const [tags, setTags] = useState<Tag[]>([]);

	useEffect(() => {
		fetchTags();
	}, []);

	const fetchTags = async () => {
		try {
			const response = await fetch("/api/tags");
			const data = await response.json();
			setTags(data.tags || []);
		} catch (error) {
			console.error("Error fetching tags:", error);
		}
	};

	const tagOptions = tags.map(tag => ({
		label: tag.name,
		value: tag.name,
		color: tag.color
	}));

	return { tags, tagOptions, refetch: fetchTags, getTagColor: (tagName: string) => tags.find(t => t.name === tagName)?.color };
}
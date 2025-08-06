"use client";

import type { Tag } from "@/types";
import {
	type ReactNode,
	createContext,
	useContext,
	useEffect,
	useState,
} from "react";

interface TagsContextType {
	tags: Tag[];
	tagOptions: { label: string; value: string; color: string }[];
	isLoading: boolean;
	refetch: () => Promise<void>;
}

const TagsContext = createContext<TagsContextType | undefined>(undefined);



interface TagsProviderProps {
	children: ReactNode;
}

export function TagsProvider({ children }: TagsProviderProps) {
	const [tags, setTags] = useState<Tag[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	const fetchTags = async () => {
		try {
			setIsLoading(true);
			const response = await fetch('/api/tags');
			const data = await response.json();
			setTags(data.tags || []);
		} catch (error) {
			console.error("Error fetching tags:", error);
			setTags([]);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchTags();
	}, []);

	const tagOptions = tags.map((tag) => ({
		label: tag.name,
		value: tag.name,
		color: tag.color,
	}));

	const value = {
		tags,
		tagOptions,
		isLoading,
		refetch: fetchTags,
	};

	return (
		<TagsContext.Provider value={value}>{children}</TagsContext.Provider>
	);
}

export function useTagsContext() {
	const context = useContext(TagsContext);
	if (context === undefined) {
		throw new Error("useTagsContext must be used within a TagsProvider");
	}
	return context;
}

"use client";

import type { Tag } from "@/types";
import { ListTagUseCase } from "@/use-cases/tag/list-tag/list-tag-use-case";
import { PrismaTagRepository } from "@/infra/repositories/database/prisma-tag-repository";
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

const tagRepository = new PrismaTagRepository();
const listTagUseCase = new ListTagUseCase(tagRepository);

interface TagsProviderProps {
	children: ReactNode;
}

export function TagsProvider({ children }: TagsProviderProps) {
	const [tags, setTags] = useState<Tag[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	const fetchTags = async () => {
		try {
			setIsLoading(true);
			const result = await listTagUseCase.execute();
			setTags(result.tags);
		} catch (error) {
			console.error("Error fetching tags:", error);
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

import { useDailyContext } from "@/contexts/daily-context";
import type { Daily } from "@/types";
import { DndContext, type DragEndEvent, closestCenter } from "@dnd-kit/core";
import {
	SortableContext,
	arrayMove,
	useSortable,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { InfoIcon } from "lucide-react";
import { Loading } from "../ui/loading";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import AddDaily from "./add-daily";
import { DailyForm } from "./daily-form";

export const DailyColumn = () => {
	return (
		<div
			className="flex flex-col flex-1 gap-4 p-2 border rounded-lg overflow-hidden animate-[slideUp_1s_ease-in-out_forwards]"
		>

			<h2 className="relative bg-background/30 p-2 border rounded-lg font-semibold text-foreground text-2xl text-center">
				Diárias
				<Tooltip >
					<TooltipTrigger asChild className="top-1 right-1 absolute">
						<InfoIcon className="w-4 h-4 text-muted-foreground/50" />
					</TooltipTrigger>
					<TooltipContent className="w-32">
						<span className="text-muted-foreground text-xs">As Diárias são repetidas em intervalos regulares. Escolha o cronograma que for mais adequado para você!</span>
					</TooltipContent>
				</Tooltip>
			</h2>

			<AddDaily />

			<Daily />
		</div>
	);
};

const Daily = () => {
	const { daily, isLoading, reorderDaily } = useDailyContext();

	if (isLoading) {
		return <Loading text="Carregando diárias..." size="lg" />;
	}

	if (daily.length === 0) {
		return (
			<div className="flex flex-1 justify-center items-center font-lg text-muted-foreground">
				Nenhuma tarefa diária ativa...{" "}
			</div>
		);
	}

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		if (!over || active.id === over.id) return;

		const oldIndex = daily.findIndex((daily) => daily.id === active.id);
		const newIndex = daily.findIndex((daily) => daily.id === over.id);

		const reorderedDaily = arrayMove(daily, oldIndex, newIndex);
		reorderDaily(reorderedDaily);
	};

	return (
		<DndContext
			collisionDetection={closestCenter}
			onDragEnd={handleDragEnd}
		>
			<SortableContext
				items={daily.map((d) => d.id)}
				strategy={verticalListSortingStrategy}
			>
				<div className="flex flex-col gap-2">
					{daily.map((daily: Daily) => {
						return (
							<SortableDailyItem key={daily.id} daily={daily} />
						);
					})}
				</div>
			</SortableContext>
		</DndContext>
	);
};

const SortableDailyItem = ({ daily }: { daily: Daily }) => {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id: daily.id,
	});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
	};

	return (
		<div ref={setNodeRef} style={style} {...attributes}>
			<DailyForm daily={daily} dragHandleProps={listeners} />
		</div>
	);
};

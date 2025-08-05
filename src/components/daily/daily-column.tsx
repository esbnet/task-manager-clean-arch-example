import AddDaily from "./add-daily";
import type { Daily } from "@/types";
import { DailyForm } from "./daily-form";
import { Loading } from "../ui/loading";
import { useDailyContext } from "@/contexts/daily-context";
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export const DailyColumn = () => {
	return (
		<div
			key={"DAILYS"}
			className="flex flex-col flex-1 gap-4 bg-background/20 opacity-0 shadow-lg backdrop-blur-md p-2 rounded-lg max-h-full overflow-hidden animate-[slideUp_1s_ease-in-out_forwards]"
		>
			<h2 className="top-0 sticky bg-background/30 shadow-sm p-2 rounded-lg font-semibold text-foreground/40 text-2xl text-center">
				Diárias
			</h2>

			<AddDaily />

			<Dailys />
		</div>
	);
};

const Dailys = () => {
	const { dailys, isLoading, reorderDailys } = useDailyContext();

	if (isLoading) {
		return <Loading text="Carregando diárias..." size="lg" />;
	}

	if (dailys.length === 0) {
		return (
			<div className="flex flex-1 justify-center items-center font-lg text-muted-foreground">
				Nenhuma tarefa diária ativa...{" "}
			</div>
		);
	}

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		if (!over || active.id === over.id) return;

		const oldIndex = dailys.findIndex((daily) => daily.id === active.id);
		const newIndex = dailys.findIndex((daily) => daily.id === over.id);

		const reorderedDailys = arrayMove(dailys, oldIndex, newIndex);
		reorderDailys(reorderedDailys);
	};

	return (
		<DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
			<SortableContext items={dailys.map(d => d.id)} strategy={verticalListSortingStrategy}>
				<div className="flex flex-col gap-2">
					{dailys.map((daily: Daily) => {
						return <SortableDailyItem key={daily.id} daily={daily} />;
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

import { useHabitContext } from "@/contexts/habit-context";
import type { Habit } from "@/types";
import { DndContext, type DragEndEvent, closestCenter } from "@dnd-kit/core";
import {
	SortableContext,
	arrayMove,
	useSortable,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Loading } from "../ui/loading";
import AddHabitForm from "./add-habit";
import { HabitForm } from "./habit-form";

export const HabitColumn = () => {
	return (
		<div
			key={"HABITS"}
			className="flex flex-col flex-1 gap-4 bg-background/20 opacity-0 shadow-lg backdrop-blur-md p-2 rounded-lg max-h-full overflow-hidden animate-[slideUp_1s_ease-in-out_forwards]"
		>
			<h2 className="top-0 sticky bg-background/30 shadow-sm p-2 rounded-lg font-semibold text-foreground/40 text-2xl text-center">
				Hábitos
			</h2>

			<AddHabitForm />

			<Habits />
		</div>
	);
};

const Habits = () => {
	const { habits, isLoading, reorderHabits } = useHabitContext();

	if (isLoading) {
		return <Loading text="Carregando hábitos..." size="lg" />;
	}

	if (habits.length === 0) {
		return (
			<div className="flex flex-1 justify-center items-center font-lg text-muted-foreground">
				Nenhum ativo...{" "}
			</div>
		);
	}

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		if (!over || active.id === over.id) return;

		const oldIndex = habits.findIndex((habit) => habit.id === active.id);
		const newIndex = habits.findIndex((habit) => habit.id === over.id);

		const reorderedHabits = arrayMove(habits, oldIndex, newIndex);
		reorderHabits(reorderedHabits);
	};

	return (
		<DndContext
			collisionDetection={closestCenter}
			onDragEnd={handleDragEnd}
		>
			<SortableContext
				items={habits.map((h) => h.id)}
				strategy={verticalListSortingStrategy}
			>
				<div className="flex flex-col gap-2">
					{habits.map((habit: Habit) => {
						return (
							<SortableHabitItem key={habit.id} habit={habit} />
						);
					})}
				</div>
			</SortableContext>
		</DndContext>
	);
};

const SortableHabitItem = ({ habit }: { habit: Habit }) => {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id: habit.id,
	});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
	};

	return (
		<div ref={setNodeRef} style={style} {...attributes}>
			<HabitForm habit={habit} dragHandleProps={listeners} />
		</div>
	);
};

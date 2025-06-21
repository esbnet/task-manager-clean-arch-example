"use client";

import { useHabitContext } from "@/contexts/habit-context";

import { useDroppable } from "@dnd-kit/core";
import { HabitCard } from "./habit-card";

export function HabitColumn() {
	const { habits } = useHabitContext();

	const { setNodeRef } = useDroppable({
		id: "HABITOS",
		data: habits,
	});

	return (
		<div
			key={"HABITOS"}
			className="flex flex-col bg-background/20 opacity-0 shadow-lg backdrop-blur-md p-2 rounded-lg max-h-full overflow-hidden animate-[slideUp_1s_ease-in-out_forwards]"
		>
			<h2 className="top-0 sticky bg-background/30 shadow-sm mb-4 p-2 rounded-lg font-semibold text-foreground/40 text-2xl text-center">
				Hábitos
			</h2>
			<div ref={setNodeRef} className="flex flex-col gap-2">
				{habits.map((habit) => {
					return <HabitCard key={habit.id} habit={habit} />;
				})}
			</div>
		</div>
	);
}

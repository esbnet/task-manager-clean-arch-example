"use client";

import { useDroppable } from "@dnd-kit/core";
import type { Task } from "../types";
import { TaskCard } from "./task-card";

type ColumnProps = {
	column: { id: string; title: string };
	tasks: Task[];
};

export function Column({ column, tasks }: ColumnProps) {
	// export function Column({ column, tasks }: ColumnProps) {
	const { setNodeRef } = useDroppable({
		id: column.id,
		data: column,
	});

	return (
		<div
			key={column.id}
			className="flex flex-col bg-background/20 opacity-0 shadow-lg backdrop-blur-md p-2 rounded-lg max-h-full overflow-hidden animate-[slideUp_1s_ease-in-out_forwards]"
		>
			<h2 className="top-0 sticky bg-background/30 shadow-sm mb-4 p-2 rounded-lg font-semibold text-foreground/40 text-2xl text-center">
				{column.title}
			</h2>
			<div ref={setNodeRef} className="flex flex-col gap-2">
				{tasks.map((task) => {
					if (task.category !== column.id) return null;
					return <TaskCard key={task.id} task={task} />;
				})}
			</div>
		</div>
	);
}

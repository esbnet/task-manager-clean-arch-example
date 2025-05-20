import type { Column as ColumnType, Task } from "./types";

import { TaskCard } from "./task-card";
import { useDroppable } from "@dnd-kit/core";
import { useRef } from "react";

type ColumnProps = {
	column: ColumnType;
	tasks: Task[];
};

export function Column({ column, tasks }: ColumnProps) {
	const { setNodeRef } = useDroppable({
		id: column.id,
		data: column,
	});

	const renderCount = useRef(0);
	renderCount.current += 1;
	console.log(
		"Droppable - esse componente re-renderizou",
		renderCount.current,
		"vezes",
	);

	return (
		<div className="flex flex-col flex-1 bg-background/20 opacity-0 shadow-lg backdrop-blur-md m-auto p-2 rounded-lg w-80 min-h-80 animate-[slideUp_1s_ease-in-out_forwards]">
			<h2 className="bg-background/30 shadow-lg mb-4 p-2 rounded-lg font-semibold text-foreground/40 text-2xl text-center">
				{column.title}
			</h2>
			<div ref={setNodeRef} className="flex flex-col gap-2">
				{tasks.map((task) => {
					return <TaskCard key={task.id} task={task} />;
				})}
			</div>
		</div>
	);
}

"use client";

import type { Column as ColumnType, Task } from "../types";

import { Column } from "./column";

const COLUMNS: ColumnType[] = [
	{ id: "DIARIAS", title: "Díarios" },
	{ id: "HABITOS", title: "Hábitos" },
	{ id: "AFAZERES", title: "Afarezer" },
];

export function Columns({ tasks }: { tasks: Task[] }) {
	return (
		<div className="flex-grow gap-2 grid grid-cols-1 md:grid-cols-3 bg-background/30 shadow-xl backdrop-blur-md p-4 rounded-lg w-full h-full animate-[fadeIn_1s_ease-in-out_forwards]">
			{COLUMNS.map((column) => {
				return <Column key={column.id} column={column} tasks={tasks} />;
			})}
		</div>
	);
}

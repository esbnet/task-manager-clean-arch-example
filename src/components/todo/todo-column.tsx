"use client";

import { TodoCard } from "./todo-card";
import { useDroppable } from "@dnd-kit/core";
import { useTodoContext } from "@/contexts/todo-context";

export function TodoColumn() {

	const { todos } = useTodoContext();


	const { setNodeRef } = useDroppable({
		id: 'TODOS',
		data: todos,
	});

	return (
		<div
			key={'TODOS'}
			className="flex flex-col bg-background/20 opacity-0 shadow-lg backdrop-blur-md p-2 rounded-lg max-h-full overflow-hidden animate-[slideUp_1s_ease-in-out_forwards]"
		>
			<h2 className="top-0 sticky bg-background/30 shadow-sm mb-4 p-2 rounded-lg font-semibold text-foreground/40 text-2xl text-center">
				Afazeres
			</h2>
			<div ref={setNodeRef} className="flex flex-col gap-2">
				{todos.map((todo) => {
					return <TodoCard key={todo.id} todo={todo} />;
				})}
			</div>
		</div>
	);
}

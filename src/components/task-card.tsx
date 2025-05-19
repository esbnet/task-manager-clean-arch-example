import {
	FcHighPriority,
	FcLowPriority,
	FcMediumPriority,
} from "react-icons/fc";
import { GripVertical, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CSS } from "@dnd-kit/utilities";
import { Checkbox } from "@/components/ui/checkbox";
import type { Task } from "./types";
import { useDraggable } from "@dnd-kit/core";
import { useRef } from "react";

type Props = {
	task: Task;
};

export function TaskCard({ task }: Props) {
	return <TaskItem task={task} />;
}

export function TaskItem({ task }: Props) {
	const { attributes, listeners, setNodeRef, transform } = useDraggable({
		id: task.id,
	});
	const style = {
		transform: CSS.Translate.toString(transform),
	};

	const onDelete = async () => {
		try {
			await fetch("/api/tasks", {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id: task.id }),
			});
			window.location.reload();
		} catch (error) {
			console.error("Erro ao deletar tarefa:", error);
		}
	};

	const renderCount = useRef(0);
	renderCount.current += 1;
	console.log(
		"Draggable - esse componente re-renderizou",
		renderCount.current,
		"vezes",
	);

	return (
		<div
			ref={setNodeRef}
			style={style}
			{...attributes}
			className="flex justify-between items-center gap-2 bg-white/30 shadow-sm hover:shadow-md p-1 border border-slate-300 rounded-sm transition-all duration-200 ease-in-out"
		>
			<div className="flex justify-between items-center gap-1 w-full">
				<div className="flex items-center gap-2">
					<Checkbox
						checked={task.completed}
						// onCheckedChange={onToggle}
						className="hover:bg-slate-950/10 focus-visible:ring-0 focus-visible:ring-slate-950/10 focus-visible:ring-offset-0 w-5 h-5 hover:cursor-pointer"
					/>
					<span
						className={
							task.completed
								? "line-through text-gray-500"
								: " text-slate-600 text-justify "
						}
					>
						{task.title}
					</span>
				</div>

				<span>
					{task.priority === "BAIXA" && (
						<FcLowPriority size={16} title="fazer depois" />
					)}
					{task.priority === "MEDIA" && (
						<FcMediumPriority size={16} title="fazer" />
					)}
					{task.priority === "ALTA" && (
						<FcHighPriority
							size={16}
							title="fazer imediatamente"
							className="animate-caret-blink"
						/>
					)}
				</span>
			</div>

			<div className="flex items-center h-full">
				<Button
					variant="ghost"
					size="sm"
					onClick={onDelete}
					className="hover:bg-slate-500/10 w-6 h-6 cursor-pointer"
					title="Deletar tarefa"
				>
					<Trash2 size={16} />
				</Button>
				<div
					className="hover:bg-slate-500/10 px-1 py-2 rounded-sm cursor-grab"
					{...listeners}
					title="Arraste para mover a tarefa"
				>
					<GripVertical size={16} className="text-slate-400" />
				</div>
			</div>
		</div>
	);
}

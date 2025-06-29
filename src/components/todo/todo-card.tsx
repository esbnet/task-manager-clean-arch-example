import { Checkbox } from "@/components/ui/checkbox";
// import { useTodoContext } from "@/contexts/todo-context";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import type { Todo } from "../../types";

type Props = {
	todo: Todo;
};

export function TodoCard({ todo }: Props) {
	return <TodoItem todo={todo} />;
}

function TodoItem({ todo }: Props) {
	const { attributes, listeners, setNodeRef, transform } = useDraggable({
		id: todo.id,
	});

	// const { updateTodo } = useTodoContext();

	// const onToggle = async (checked: boolean) => {
	// 	await updateTodo({ ...todo, completed: checked });
	// 	toast.success(
	// 		`Tarefa ${checked ? "concluída" : "desfeita"} com sucesso!`,
	// 	);
	// };

	const style = {
		transform: CSS.Translate.toString(transform),
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			{...attributes}
			className="flex justify-between items-center gap-2 bg-background/30 shadow-sm hover:shadow-md p-1 rounded-sm transition-all duration-200 ease-in-out"
		>
			<div
				className="hover:bg-background/10 px-1 py-2 rounded-sm cursor-grab"
				{...listeners}
				title="Arraste para mover a tarefa"
			>
				<GripVertical size={16} className="text-foreground" />
			</div>
			<div className="flex justify-between items-center gap-1 w-full">
				<div className="flex items-center gap-2">
					<Checkbox
						// checked={todo.completed}
						// onCheckedChange={onToggle}
						className="hover:bg-foreground/10 border-foreground/30 focus-visible:ring-0 focus-visible:ring-offset-0 w-5 h-5 focus-visible:bg-accent-foreground hover:cursor-pointer"
					/>
					<span className={" text-foreground/60 text-justify "}>
						{todo.title}
					</span>
				</div>
			</div>
		</div>
	);
}

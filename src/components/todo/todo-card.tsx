import { Checkbox } from "@/components/ui/checkbox";
import { useTodoContext } from "@/contexts/todo-context";
import { GripVertical } from "lucide-react";
import { toast } from "sonner";
import type { Todo } from "../../types";

type Props = {
	todo: Todo;
	dragHandleProps?: any;
	onEditClick?: () => void;
};

export function TodoCard({ todo, dragHandleProps, onEditClick }: Props) {
	return <TodoItem todo={todo} dragHandleProps={dragHandleProps} onEditClick={onEditClick} />;
}

function TodoItem({ todo, dragHandleProps, onEditClick }: Props) {
	const { completeTodo } = useTodoContext();

	const onComplete = async (checked: boolean) => {
		if (checked) {
			await completeTodo(todo);
			toast.success(`Afazer "${todo.title}" concluído!`);
		}
	};

	return (
		<div className="flex justify-between items-center gap-2 bg-background/30 shadow-sm hover:shadow-md p-1 rounded-sm transition-all duration-200 ease-in-out">
			<div
				className="hover:bg-background/10 px-1 py-2 rounded-sm cursor-grab"
				{...dragHandleProps}
				title="Arraste para mover a tarefa"
			>
				<GripVertical size={16} className="text-foreground" />
			</div>
			<div className="flex justify-between items-center gap-1 w-full">
				<div className="flex items-center gap-2">
					<Checkbox
						onCheckedChange={onComplete}
						className="hover:bg-foreground/10 border-foreground/30 focus-visible:ring-0 focus-visible:ring-offset-0 w-5 h-5 focus-visible:bg-accent-foreground hover:cursor-pointer"
						onClick={(e) => e.stopPropagation()}
					/>
					<span 
						className="text-foreground/60 text-justify cursor-pointer hover:text-foreground/80"
						onClick={onEditClick}
					>
						{todo.title}
					</span>
				</div>
			</div>
		</div>
	);
}

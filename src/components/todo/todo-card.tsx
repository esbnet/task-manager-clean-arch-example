import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog";
import { Edit2, GripVertical, Trash2 } from "lucide-react";

import { Button } from "../ui/button";
import { CSS } from "@dnd-kit/utilities";
import { Checkbox } from "@/components/ui/checkbox";
import { DialogClose } from "@radix-ui/react-dialog";
import {
	FcLowPriority
} from "react-icons/fc";
import type { Todo } from "../../types";
import { TodoForm } from "./todo-form";
import { toast } from "sonner";
import { useDraggable } from "@dnd-kit/core";
import { useTodoContext } from "@/contexts/todo-context";

type Props = {
	todo: Todo;
};

export function TodoCard({ todo }: Props) {
	return <TodoItem todo={todo} />;
}

export function TodoItem({ todo }: Props) {
	const { attributes, listeners, setNodeRef, transform } = useDraggable({
		id: todo.id,
	});

	const { updateTodo } = useTodoContext();

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
					<span
						className={" line-through text-foreground/30 "
							// todo.completed
							// 	? "line-through text-foreground/30 "
							// 	: " text-foreground/60 text-justify "
						}
					>
						{todo.title}
					</span>
				</div>

				<span>
					{todo.difficulty === "Trivial" && (
						<FcLowPriority size={16} title="fazer depois" />
					)}
				</span>
			</div>

			<div className="flex items-center h-full">
				<TodoForm todo={todo} icon={<Edit2 size={16} />} />
				<DialogConfirmDelete id={todo.id} />
			</div>
		</div>
	);
}

function DialogConfirmDelete({ id }: { id: string }) {
	const { deleteTodo } = useTodoContext();
	const onDelete = async () => {
		await deleteTodo(id);
		toast.success("Tarefa excluída com sucesso!");
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					variant="ghost"
					size="sm"
					className="flex justify-center items-center hover:bg-background/20 rounded-lg w-6 h-6 cursor-pointer"
				>
					<Trash2 size={16} />
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Você tem certeza?</DialogTitle>
					<DialogDescription>
						Confirmando a exclusão, você não poderá desfazer essa
						ação.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button
						type="submit"
						variant={"destructive"}
						onClick={onDelete}
					>
						Excluir
					</Button>
					<DialogClose asChild>
						<Button variant="outline">Cancel</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

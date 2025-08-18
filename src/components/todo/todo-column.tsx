import { useTodoContext } from "@/contexts/todo-context";
import type { Todo } from "@/types";
import { DndContext, type DragEndEvent, closestCenter } from "@dnd-kit/core";
import {
	SortableContext,
	arrayMove,
	useSortable,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { InfoIcon } from "lucide-react";
import { Loading } from "../ui/loading";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import AddTodo from "./add-todo";
import { TodoForm } from "./todo-form";

export const TodoColumn = () => {
	return (
		<div
			className="flex flex-col flex-1 gap-4 p-2 border rounded-lg overflow-hidden animate-[slideUp_1s_ease-in-out_forwards]"
		>

			<h2 className="relative bg-todo p-2 border rounded-lg font-semibold text-foreground text-2xl text-center">
				Afazeres
				<Tooltip >
					<TooltipTrigger asChild className="top-1 right-1 absolute">
						<InfoIcon className="w-4 h-4 text-muted-foreground/50" />
					</TooltipTrigger>
					<TooltipContent className="w-32">
						<span className="text-muted-foreground text-xs">Afazeres precisam ser concluídos apenas uma vez. Adicione listas de tarefas em seus Afazeres para aumentar o valor deles.</span>
					</TooltipContent>
				</Tooltip>
			</h2>
			<AddTodo />

			<Todos />
		</div>
	);
};

const Todos = () => {
	const { todos, isLoading, reorderTodos } = useTodoContext();

	if (isLoading) {
		return <Loading text="Carregando afazeres..." size="lg" />;
	}

	if (todos.length === 0) {
		return (
			<div className="flex flex-1 justify-center items-center font-lg text-muted-foreground">
				Nenhum afazer ativo...{" "}
			</div>
		);
	}

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		if (!over || active.id === over.id) return;

		const oldIndex = todos.findIndex((todo) => todo.id === active.id);
		const newIndex = todos.findIndex((todo) => todo.id === over.id);

		const reorderedTodos = arrayMove(todos, oldIndex, newIndex);
		reorderTodos(reorderedTodos);
	};

	return (
		<DndContext
			collisionDetection={closestCenter}
			onDragEnd={handleDragEnd}
		>
			<SortableContext
				items={todos.map((t) => t.id)}
				strategy={verticalListSortingStrategy}
			>
				<div className="flex flex-col gap-2">
					{todos.map((todo: Todo) => {
						return <SortableTodoItem key={todo.id} todo={todo} />;
					})}
				</div>
			</SortableContext>
		</DndContext>
	);
};

const SortableTodoItem = ({ todo }: { todo: Todo }) => {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id: todo.id,
	});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
	};

	return (
		<div ref={setNodeRef} style={style} {...attributes}>
			<TodoForm todo={todo} dragHandleProps={listeners} />
		</div>
	);
};

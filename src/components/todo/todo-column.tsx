import { useTodoContext } from "@/contexts/todo-context";
import type { Todo } from "@/types";
import { useDroppable } from "@dnd-kit/core";
import { Loading } from "../ui/loading";
import { TodoCard } from "./todo-card";

export const TodoColumn = () => {
	return (
		<div
			key={"TODOS"}
			className="flex flex-col flex-1 bg-background/20 opacity-0 shadow-lg backdrop-blur-md p-2 rounded-lg max-h-full overflow-hidden animate-[slideUp_1s_ease-in-out_forwards]"
		>
			<h2 className="top-0 sticky bg-background/30 shadow-sm mb-4 p-2 rounded-lg font-semibold text-foreground/40 text-2xl text-center">
				Afazeres
			</h2>

			<Todos />
		</div>
	);
}

const Todos = () => {
	const { todos, isloading } = useTodoContext();

	if (isloading) {
		return <Loading text="Carregando afazeres..." size="lg" />;
	}

	if (todos.length === 0) {
		return <div className="flex flex-1 justify-center items-center font-lg text-muted-foreground">Nenhum ativo... </div>
	}

	const { setNodeRef } = useDroppable({
		id: "TODOS",
		data: todos,
	});

	return (
		<div ref={setNodeRef} className="flex flex-col gap-2">
			{todos.map((todo: Todo) => {
				return <TodoCard key={todo.id} todo={todo} />;
			})}
		</div>
	);
}

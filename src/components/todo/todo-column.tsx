import AddTodo from "./add-todo";
import { Loading } from "../ui/loading";
import type { Todo } from "@/types";
import { TodoForm } from "./todo-form";
import { useTodoContext } from "@/contexts/todo-context";

export const TodoColumn = () => {
	return (
		<div
			key={"TODOS"}
			className="flex flex-col flex-1 gap-4 bg-background/20 opacity-0 shadow-lg backdrop-blur-md p-2 rounded-lg max-h-full overflow-hidden animate-[slideUp_1s_ease-in-out_forwards]"
		>
			<h2 className="top-0 sticky bg-background/30 shadow-sm p-2 rounded-lg font-semibold text-foreground/40 text-2xl text-center">
				Afazeres
			</h2>

			<AddTodo />

			<Todos />
		</div>
	);
};

const Todos = () => {
	const { todos, isLoading } = useTodoContext();

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

	return (
		<div className="flex flex-col gap-2">
			{todos.map((todo: Todo) => {
				return <TodoForm key={todo.id} todo={todo} />;
			})}
		</div>
	);
};

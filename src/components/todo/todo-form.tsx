import { CalendarIcon, Plus, SaveIcon, Trash2 } from "lucide-react";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { Todo, TodoDificult } from "../../types";
import { format, setDefaultOptions } from "date-fns";

import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { TodoCard } from "./todo-card";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { useState } from "react";
import { useTodoContext } from "@/contexts/todo-context";

setDefaultOptions({ locale: ptBR });

interface TodoFormProps {
	todo: Todo
}

export function TodoForm({ todo }: TodoFormProps) {
	const { updateTodo, addTodo } = useTodoContext();

	const [title, setTitle] = useState(todo.title || "");
	const [observations, setObservations] = useState(todo.observations || "");
	const [tasks, setTodo] = useState<string[]>(todo.tasks || []);
	const [difficult, setDifficult] = useState<TodoDificult>(
		todo.difficult || "Fácil",
	);
	const [startDate, setStartDate] = useState(todo.startDate || new Date());
	const [tags, setTags] = useState<string[]>(todo.tags || []);

	const [selectedTags, setSelectedTags] = useState<string[]>([]);
	const [open, setOpen] = useState(false);

	async function handleUpdateTodo() {
		if (!title.trim()) return;

		try {
			await updateTodo({
				...todo,
				title,
				observations: todo.observations || "",
				tasks: todo.tasks || [],
				difficulty: difficult,
				startDate: todo.startDate || new Date(),
				tags: todo.tags || [],
			} as Todo);

			toast.success("Tarefa atualizada com sucesso!");
			setOpen(false);
		} catch (error) {
			toast.error(`Erro ao atualizar tarefa${error}`);
			console.error("Erro ao atualizar tarefa", error);
		}
	}

	async function handleAddTodo() {
		if (!title.trim()) {
			toast.warning("Título da tarefa é obrigatório");
			return;
		}

		try {
			await addTodo({
				title,
				observations: todo.observations || "",
				tasks: [] as string[],
				difficult: difficult,
				startDate: new Date(),
				tags: [] as string[],
			});

			setTitle("");
			setDifficult(difficult);
			setTags(tags);
			toast.success("Hábito criada com sucesso!");
			setOpen(false);
		} catch (error) {
			toast.error(`Erro ao criar hábito ${error}`);
			console.error("Erro ao criar hábito", error);
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger className="outline-none">
				<TodoCard todo={todo} />
			</DialogTrigger>
			<DialogContent className="flex flex-col gap-6 bg-transparent backdrop-blur-sm">
				<DialogHeader>
					<DialogTitle>Editar Tarefa</DialogTitle>
					<DialogDescription className="text-zinc-400 text-sm">
						{todo.id
							? "Altere os detalhes da tarefa"
							: "Adicione uma nova tarefa"}
					</DialogDescription>
				</DialogHeader>

				<div className="flex flex-col gap-4 bg-gray-100/20 p-2 py-4 rounded-lg text-muted-background animate-[fadeIn_1s_ease-in-out_forwards]">
					<div className="flex flex-col gap-1">
						<Label className="font-bold">Título</Label>
						<Input
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							placeholder="Nova diária"
							required
						/>
					</div>
					<div className="flex flex-col gap-1">
						<Label className="font-bold">Observação</Label>
						<Input
							value={observations}
							onChange={(e) => setObservations(e.target.value)}
							placeholder="Adicionar observações"
						/>
					</div>
					<div className="flex flex-col gap-1">
						<Label className="font-bold">Lista de tarefas</Label>
						<Input
							value={tasks.join(",") || ""}
							onChange={(e) => setTodo(e.target.value.split(",").map(todo => todo.trim()).filter(Boolean))}
							placeholder="Novo item da lista de tarefas"
							required
						/>
					</div>
					<div className="flex flex-col gap-1">
						<Label className="font-bold">Dificuldade</Label>
						<Select
							onValueChange={(value) =>
								setDifficult(value as TodoDificult)
							}
							value={difficult || "Fácil"}
						>
							<SelectTrigger className="w-full">
								<SelectValue
									placeholder="Dificuldade"
									className="text-zinc-300"
								/>
							</SelectTrigger>
							<SelectContent
								className="w-full"
								defaultValue={difficult || "Fácil"}
							>
								<SelectItem value="Trivial" className="justify-between" >Trival ⭐</SelectItem>
								<SelectItem value="Fácil">Fácil ⭐⭐</SelectItem>
								<SelectItem value="Média">Média ⭐⭐⭐</SelectItem>
								<SelectItem value="Difícil">Difícil ⭐⭐⭐⭐</SelectItem>
							</SelectContent>
						</Select>

					</div>
					<div className="flex flex-col gap-1">
						<Label className="font-bold">Data de início</Label>
						<Popover>
							<PopoverTrigger asChild>
								<Button
									variant="outline"
									data-empty={!startDate}
									className="justify-start w-full font-normal data-[empty=true]:text-muted-foreground text-left"
								>
									<CalendarIcon />
									{startDate ? format(startDate, "PPP", { locale: ptBR }) : <span>Pick a date</span>}
								</Button>
							</PopoverTrigger>
							<PopoverContent className="p-0 w-auto">
								<Calendar mode="single" required={true} selected={startDate} onSelect={setStartDate} />
							</PopoverContent>
						</Popover>
					</div>

					<Button
						onClick={todo.id ? handleUpdateTodo : handleAddTodo}
					>
						{todo.id ? <SaveIcon /> : <Plus />}
						{todo.id ? "Salvar" : "Adicionar"}
					</Button>
				</div>
				<div className="flex justify-right items-center">
					<DialogConfirmDelete id={todo.id} />
				</div>


			</DialogContent>
		</Dialog>
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
				<div className="flex justify-center items-center mt-4 w-full">
					<Button
						variant="link"
						// size="sm"
						className="flex justify-center items-center hover:bg-background/20 rounded-lg text-destructive cursor-pointer"
					>
						<Trash2 size={16} /> Delete este(a) Afazer
					</Button>
				</div>
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
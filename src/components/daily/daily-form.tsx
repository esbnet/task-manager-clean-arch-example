import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	FcHighPriority,
	FcLowPriority,
	FcMediumPriority,
} from "react-icons/fc";
import type { Daily, DailyDificult, } from "../../types";

import { useDailyContext } from "@/contexts/daily-context";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface DailyFormProps {
	daily: Partial<Daily> & Pick<Daily, "observations" | "tags" | "difficulty" | "title">;
	icon: React.ReactNode;
}

export function DailyForm({ daily, icon }: DailyFormProps) {
	const { updateDaily, addDaily } = useDailyContext();

	const [title, setTitle] = useState(daily.title || "");

	const [dificulty, setDifficulty] = useState<DailyDificult>(
		daily.difficulty || "Fácil")
	const [tags, setTags] = useState<string[]>(daily.tags || []);


	const [open, setOpen] = useState(false);

	async function handleUpdateDaily() {
		if (!title.trim()) return;

		try {
			await updateDaily({
				...daily,
				title,
				observations: daily.observations || "",
				difficulty: dificulty,
				tags,
			} as Daily);

			toast.success("Tarefa atualizada com sucesso!");
			setOpen(false);
		} catch (error) {
			toast.error(`Erro ao atualizar tarefa${error}`);
			console.error("Erro ao atualizar tarefa", error);
		}
	}

	async function handleAddDaily() {
		if (!title.trim()) {
			toast.warning("Título da tarefa é obrigatório");
			return;
		}

		try {
			await addDaily({
				title,
				observations: daily.observations || "",
				difficulty: dificulty,
				tags,
				startDate: new Date(),
				tasks: [] as string[],
				createdAt: new Date(),
			} as Daily);

			setTitle("");
			setDifficulty(dificulty);
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
				{icon}
				<span className="sr-only">Edit daily</span>
			</DialogTrigger>
			<DialogContent className="flex flex-col gap-2 bg-transparent backdrop-blur-sm">
				<DialogHeader>
					<DialogTitle>Editar Tarefa</DialogTitle>
					<DialogDescription className="text-zinc-400 text-sm">
						{daily.id
							? "Edite os detalhes da tarefa"
							: "Adicione uma nova tarefa"}
					</DialogDescription>
				</DialogHeader>

				<div className="flex flex-col gap-2 bg-zinc-100/30 opacity-0 shadow-xl backdrop-blur-md p-4 rounded-lg animate-[fadeIn_1s_ease-in-out_forwards]">
					<Input
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						placeholder="Nova tarefa"
						required
					/>
					<Select
						onValueChange={(value) =>
							setDifficulty(
								value as DailyDificult
							)
						}
						value={dificulty}
					>
						<SelectTrigger className="w-[180px]">
							<SelectValue
								placeholder="Dificuldade"
								className="text-zinc-300"
							/>
						</SelectTrigger>
						<SelectContent
							className="w-[180px]"
							defaultValue={dificulty}
						>
							<SelectItem value="Trivial">Trival</SelectItem>
							<SelectItem value="Fácil">Fácil</SelectItem>
							<SelectItem value="Média">Média</SelectItem>
							<SelectItem value="Difícil">Difícil</SelectItem>
						</SelectContent>
					</Select>

					<Select
						onValueChange={(value) =>
							setTags(
								value.split(","))
						}
						value={tags.join(",") || ""}
					>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder="Prioridade" />
						</SelectTrigger>
						<SelectContent className="w-[180px]">
							<SelectItem value="BAIXA">
								<FcLowPriority size={24} /> Baixa
							</SelectItem>
							<SelectItem value="MEDIA">
								<FcMediumPriority size={24} /> Média
							</SelectItem>
							<SelectItem value="ALTA">
								<FcHighPriority size={24} /> Alta
							</SelectItem>
						</SelectContent>
					</Select>

					<Button
						onClick={daily.id ? handleUpdateDaily : handleAddDaily}
					>
						{daily.id ? "Atualizar" : "Adicionar"}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}

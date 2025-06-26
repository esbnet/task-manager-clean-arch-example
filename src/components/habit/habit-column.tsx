import { useHabitContext } from "@/contexts/habit-context";
import type { Habit } from "@/types";
import { useDroppable } from "@dnd-kit/core";
import { Plus } from "lucide-react";
import { Loading } from "../ui/loading";
import { HabitCard } from "./habit-card";
import { HabitForm } from "./habit-form";

export const HabitColumn = () => {

	return (
		<div
			key={"HABITOS"}
			className="flex flex-col flex-1 bg-background/20 opacity-0 shadow-lg backdrop-blur-md p-2 rounded-lg max-h-full overflow-hidden animate-[slideUp_1s_ease-in-out_forwards]"
		>
			<h2 className="top-0 sticky bg-background/30 shadow-sm mb-4 p-2 rounded-lg font-semibold text-foreground/40 text-2xl text-center">
				Hábitos
			</h2>

			<HabitForm
				habit={{
					id: "",
					title: "",
					observations: "",
					difficult: "Fácil",
					tags: [],
					reset: "Diariamente",
					createdAt: new Date(),
				}}
				icon={<Plus />}
			/>

			<Habits />
		</div>
	);
}

const Habits = () => {
	const { habits, isloading } = useHabitContext();

	if (habits.length === 0) {
		return <Loading text="Carregando hábitos..." size="lg" />;
	}

	if (habits.length === 0) {
		return <div className="flex flex-1 justify-center items-center font-lg text-muted-foreground">Nenhum ativo... </div>
	}


	const { setNodeRef } = useDroppable({
		id: "HABITOS",
		data: habits,
	});

	return (
		<div ref={setNodeRef} className="flex flex-col gap-2">
			{habits.map((habit: Habit) => {
				return <HabitCard key={habit.id} habit={habit} />;
			})}
		</div>
	);
}
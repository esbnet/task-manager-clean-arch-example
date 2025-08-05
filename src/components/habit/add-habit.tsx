import { useHabitContext } from "@/contexts/habit-context";
import type { Habit } from "@/types";
import { useState } from "react";
import { toast } from "sonner";
import { Input } from "../ui/input";

export default function AddHabit() {
    const [habit, setHabit] = useState<Omit<Habit, "id" | "createdAt">>({
        title: "",
        observations: "",
        difficulty: "Fácil",
        tags: [],
        reset: "Diariamente",
    });

    const [title, setTitle] = useState("");
    const { addHabit } = useHabitContext();

    function handleAddHabit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!title.trim()) {
            toast.warning("Título do hábito é obrigatório");
            return;
        }

        // Criar o objeto com os dados atualizados
        const newHabit = {
            title,
            observations: habit.observations || "",
            difficulty: habit.difficulty || "Fácil",
            tags: habit.tags || [],
            reset: habit.reset || "Diariamente",
        };

        // Usar o objeto criado diretamente
        addHabit(newHabit);

        // Atualizar o estado e limpar o formulário
        setHabit({
            title: "",
            observations: "",
            difficulty: "Fácil",
            tags: [],
            reset: "Diariamente",
        });
        setTitle("");
    }

    return (
        <form onSubmit={handleAddHabit}>
            <Input
                id="title"
                placeholder="Adicionar Hábito"
                onChange={(e) => setTitle(e.target.value)}
                value={title}
            />
        </form>
    );
}

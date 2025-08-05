import type { Daily, DailyRepeat } from "@/types";

import { useDailyContext } from "@/contexts/daily-context";
import { useState } from "react";
import { toast } from "sonner";
import { Input } from "../ui/input";

export default function AddDaily() {
    const [daily, setDaily] = useState<Omit<Daily, "id" | "createdAt">>({
        title: "",
        observations: "",
        difficulty: "Fácil",
        tags: [],
        repeat: {
            type: "Diariamente",
            frequency: 1
        } as DailyRepeat,
        startDate: new Date(),
        tasks: [],
    });

    const [title, setTitle] = useState("");
    const { addDaily } = useDailyContext();

    function handleAddDaily(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!title.trim()) {
            toast.warning("Título do hábito é obrigatório");
            return;
        }

        // Criar o objeto com os dados atualizados
        const newDaily = {
            title,
            observations: daily.observations || "",
            difficulty: daily.difficulty || "Fácil",
            tags: daily.tags || [],
            repeat: daily.repeat || {
                type: "Diariamente",
                frequency: 1
            },
            startDate: daily.startDate || new Date(),
            tasks: daily.tasks || [],
        };

        // Usar o objeto criado diretamente
        addDaily(newDaily);

        // Atualizar o estado e limpar o formulário
        setDaily({
            title: "",
            observations: "",
            difficulty: "Fácil",
            tags: [],
            repeat: {
                type: "Diariamente",
                frequency: 1
            },
            startDate: new Date(),
            tasks: [],
        });
        setTitle("");
    }

    return (
        <form onSubmit={handleAddDaily}>
            <Input
                id="title"
                placeholder="Adicionar Diária"
                onChange={(e) => setTitle(e.target.value)}
                value={title}
            />
        </form>
    );
}

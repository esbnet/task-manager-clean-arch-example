"use client";

import { useDailyContext } from "@/contexts/daily-context";
import { useDroppable } from "@dnd-kit/core";
import { Plus } from "lucide-react";
import { DailyCard } from "./daily-card";
import { DailyForm } from "./daily-form";

export function DailyColumn() {
	const { dailys } = useDailyContext();

	const { setNodeRef } = useDroppable({
		id: "DAILYOS",
		data: dailys,
	});

	return (
		<div
			key={"DAILYS"}
			className="flex flex-col bg-background/20 opacity-0 shadow-lg backdrop-blur-md p-2 rounded-lg max-h-full overflow-hidden animate-[slideUp_1s_ease-in-out_forwards]"
		>
			<h2 className="top-0 sticky bg-background/30 shadow-sm mb-4 p-2 rounded-lg font-semibold text-foreground/40 text-2xl text-center">
				Diárias
			</h2>

			<DailyForm
				daily={{
					id: "",
					title: "",
					observations: "",
					tasks: [],
					difficulty: "Fácil",
					startDate: new Date(),
					repeat: {
						type: "Semanalmente",
						frequency: 1,
					},
					tags: [],
					createdAt: new Date(),
				}}
				icon={<Plus />}
			/>


			<div ref={setNodeRef} className="flex flex-col gap-2">
				{dailys.map((daily) => {
					return <DailyCard key={daily.id} daily={daily} />;
				})}
			</div>
		</div>
	);
}

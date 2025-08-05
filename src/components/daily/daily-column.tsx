import AddDaily from "./add-daily";
import type { Daily } from "@/types";
import { DailyForm } from "./daily-form";
import { Loading } from "../ui/loading";
import { useDailyContext } from "@/contexts/daily-context";

export const DailyColumn = () => {
	return (
		<div
			key={"DAILYS"}
			className="flex flex-col flex-1 gap-4 bg-background/20 opacity-0 shadow-lg backdrop-blur-md p-2 rounded-lg max-h-full overflow-hidden animate-[slideUp_1s_ease-in-out_forwards]"
		>
			<h2 className="top-0 sticky bg-background/30 shadow-sm p-2 rounded-lg font-semibold text-foreground/40 text-2xl text-center">
				Diárias
			</h2>

			<AddDaily />

			<Dailys />
		</div>
	);
};

const Dailys = () => {
	const { dailys, isLoading } = useDailyContext();

	if (isLoading) {
		return <Loading text="Carregando diárias..." size="lg" />;
	}

	if (dailys.length === 0) {
		return (
			<div className="flex flex-1 justify-center items-center font-lg text-muted-foreground">
				Nenhuma tarefa diária ativa...{" "}
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-2">
			{dailys.map((daily: Daily) => {
				return <DailyForm key={daily.id} daily={daily} />;
			})}
		</div>
	);
};

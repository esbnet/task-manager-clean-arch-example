import type { Daily } from "@/domain/entities/daily";
import type { DailyRepository } from "@/domain/repositories/all-repository";
import { InMemoryGenericRepository } from "./in-memory-generic-repository";

export class InMemoryDailyRepository
	extends InMemoryGenericRepository<Daily>
	implements DailyRepository
{
	constructor() {
		super();
		// Inicializar com dados de exemplo se necessário
		this.items = [
			{
				id: "1",
				title: "Daily task example",
				// adicione outras propriedades específicas do Daily aqui
				observations: "This is an example observation.",
				tasks: ["Task 1", "Task 2"],
				difficulty: "Fácil",
				startDate: new Date(),
				repeat: {
					type: "Diariamente",
					frequency: 1,
				},
				tags: ["example", "daily"],
				createdAt: new Date(),
			},
		];
	}
}

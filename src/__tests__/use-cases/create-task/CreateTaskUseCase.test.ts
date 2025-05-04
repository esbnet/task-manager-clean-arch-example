import { CreateTaskUseCase } from "@/use-cases/create-task/create-task-use-case";
import { InMemoryTaskRepository } from "@/infra/repositories/in-memory-task-repository";

describe("Use Case: CreateTaskUseCase", () => {
	it("deve criar uma nova tarefa", async () => {
		const repo = new InMemoryTaskRepository();
		const useCase = new CreateTaskUseCase(repo);

		const result = await useCase.execute({ title: "Estudar" });

		expect(result.task.title).toBe("Estudar");
		expect(result.task.completed).toBe(false);
	});
});

import { InMemoryTaskRepository } from "@/infra/repositories/in-memory-task-repository";
import { ListTasksUseCase } from "@/use-cases/list-tasks/list-task-use-case";

describe("Use Case: ListTasksUseCase", () => {
	it("deve retornar uma lista de tarefas", async () => {
		const repo = new InMemoryTaskRepository();
		const useCase = new ListTasksUseCase(repo);

		await repo.create({ title: "Tarefa 1", completed: false });
		await repo.create({ title: "Tarefa 2", completed: true });

		const result = await useCase.execute();

		expect(result.tasks.length).toBe(2);
		expect(result.tasks[0].title).toBe("Tarefa 1");
	});
});

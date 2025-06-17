import { InMemoryTaskRepository } from "@/infra/repositories/in-memory-task-repository";
import type { CreateTaskInput } from "@/use-cases/task/create-task/create-task-dto";
import { CreateTaskUseCase } from "@/use-cases/task/create-task/create-task-use-case";

describe("CreateTaskUseCase", () => {
	let useCase: CreateTaskUseCase;
	let taskRepository: InMemoryTaskRepository;

	beforeEach(() => {
		taskRepository = new InMemoryTaskRepository();
		useCase = new CreateTaskUseCase(taskRepository);
	});

	it("deve criar uma tarefa", async () => {
		const inputTask: CreateTaskInput = {
			title: "Tarefa 1",
			category: "HABITOS",
			priority: "BAIXA",
		};

		const result = await useCase.execute(inputTask);

		expect(result.task).toBeDefined();
		expect(result.task.title).toBe(inputTask.title);
		expect(result.task.completed).toBe(false);
		expect(result.task.category).toBe(inputTask.category);
		expect(result.task.priority).toBe(inputTask.priority);
	});

	it("deve criar uma tarefa com categoria e prioridade padrão", async () => {
		const inputTask: CreateTaskInput = {
			title: "Tarefa 1",
			category: "HABITOS",
			priority: "BAIXA",
		};

		const result = await useCase.execute(inputTask);

		expect(result.task).toBeDefined();
		expect(result.task.title).toBe(inputTask.title);
		expect(result.task.completed).toBe(false);
		expect(result.task.category).toBe("HABITOS");
		expect(result.task.priority).toBe("BAIXA");
	});
});

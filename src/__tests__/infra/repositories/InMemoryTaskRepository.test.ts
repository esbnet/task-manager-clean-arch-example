import { InMemoryTaskRepository } from "@/infra/repositories/in-memory-task-repository";

describe("Infra: InMemoryTaskRepository", () => {
	let repo: InMemoryTaskRepository;

	beforeEach(() => {
		repo = new InMemoryTaskRepository();
	});

	it("deve criar uma nova tarefa", async () => {
		const task = await repo.create({
			title: "Nova tarefa",
			completed: false,
		});

		expect(task.id).toBeDefined();
		expect(task.title).toBe("Nova tarefa");
		expect(task.completed).toBe(false);
	});

	it("deve listar todas as tarefas", async () => {
		await repo.create({ title: "Tarefa 1", completed: false });
		await repo.create({ title: "Tarefa 2", completed: true });

		const tasks = await repo.list();

		expect(tasks.length).toBe(2);
		expect(tasks[0].title).toBe("Tarefa 1");
		expect(tasks[1].completed).toBe(true);
	});

	it("deve marcar como concluída", async () => {
		const task = await repo.create({ title: "Tarefa", completed: false });
		const updated = await repo.toggleComplete(task.id);

		expect(updated.completed).toBe(true);
	});

	it("deve excluir uma tarefa", async () => {
		const task = await repo.create({ title: "Excluir", completed: false });
		await repo.delete(task.id);
		const tasks = await repo.list();

		expect(tasks.length).toBe(0);
	});
});

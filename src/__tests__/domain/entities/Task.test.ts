import type { Task } from '@/domain/entities/task';

describe('Domain: Task', () => {
  it('deve ter os campos obrigatórios', () => {
    const task: Task = {
      id: '1',
      title: 'Estudar Clean Architecture',
      completed: false,
      createdAt: new Date(),
    };

    expect(task).toHaveProperty('id');
    expect(task).toHaveProperty('title');
    expect(task).toHaveProperty('completed');
    expect(task).toHaveProperty('createdAt');
  });
});
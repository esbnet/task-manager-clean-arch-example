export class TaskTitle {
	private constructor(private readonly value: string) {}

	static create(title: string): TaskTitle {
		if (!title || title.trim().length === 0) {
			throw new Error("Title cannot be empty");
		}
		
		if (title.trim().length > 100) {
			throw new Error("Title cannot exceed 100 characters");
		}

		return new TaskTitle(title.trim());
	}

	getValue(): string {
		return this.value;
	}

	equals(other: TaskTitle): boolean {
		return this.value === other.value;
	}
}
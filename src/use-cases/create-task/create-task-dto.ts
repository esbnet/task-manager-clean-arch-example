export type CreateTaskInput = {
	title: string;
	category: string;
	priority: string;
};

export type CreateTaskOutput = {
	task: {
		id: string;
		title: string;
		completed: boolean;
		createdAt: Date;
		category: string;
		priority: string;
	};
};

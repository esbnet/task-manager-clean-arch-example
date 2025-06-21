export interface BaseEntity {
	id: string;
	createdAt: Date;
}

export type CreateEntityData<T extends BaseEntity> = Omit<
	T,
	"id" | "createdAt"
>;

export interface GenericRepository<T extends BaseEntity> {
	create(data: CreateEntityData<T>): Promise<T>;
	list(): Promise<T[]>;
	update(entity: T): Promise<T>;
	toggleComplete(id: string): Promise<T>;
	delete(id: string): Promise<void>;
}

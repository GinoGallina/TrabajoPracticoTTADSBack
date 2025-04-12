import { EntityManager, Repository, IsNull, DeepPartial, ObjectLiteral, FindOptionsWhere } from "typeorm";

export abstract class BaseRepository<T extends ObjectLiteral> {
	protected readonly repository: Repository<T>;

	constructor(repository: Repository<T>) {
		this.repository = repository;
	}

	getRepo(manager?: EntityManager): Repository<T> {
		return manager ? manager.getRepository(this.repository.target) : this.repository;
		// return manager ? manager.getRepository(this.repository.target as T) : this.repository;
	}

	async getAll(): Promise<T[]> {
		return this.repository.find({
			where: { DeletedAt: IsNull() } as FindOptionsWhere<T>,
		});
	}

	async getById(id: string): Promise<T | null> {
		const entityId = Number(id);
		if (isNaN(entityId)) return null;

		return this.repository.findOne({
			where: { Id: entityId, DeletedAt: IsNull() } as FindOptionsWhere<T>,
		});
	}

	async create(data: DeepPartial<T>, manager?: EntityManager): Promise<T> {
		const repo = this.getRepo(manager);
		const entity = repo.create(data);
		return repo.save(entity);
	}

	async update(id: string, data: DeepPartial<T>): Promise<T | null> {
		const entity = await this.getById(id);
		if (!entity) return null;

		Object.assign(entity, data);
		return this.repository.save(entity);
	}

	async delete(id: string, manager?: EntityManager): Promise<boolean | null> {
		const entityId = Number(id);
		if (isNaN(entityId)) return null;

		const repo = this.getRepo(manager);
		const result = await repo.softDelete(entityId);
		return result.affected !== 0;
	}
}

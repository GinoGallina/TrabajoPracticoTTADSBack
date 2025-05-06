import {
	EntityManager,
	FindOptionsOrder,
	FindOptionsRelations,
	FindOptionsSelect,
	FindOptionsWhere,
	IsNull,
	Repository,
} from "typeorm";
import { BaseModel } from "../models/database/BaseModel.js";

export class BaseRepository<T extends BaseModel> {
	constructor(
		private readonly entity: new () => T,
		private readonly repository: Repository<T>,
	) {}

	getRepo(manager?: EntityManager): Repository<T> {
		return manager ? manager.getRepository(this.entity) : this.repository;
	}

	async getById(
		id: number,
		options?: {
			includeDeleted?: boolean;
			select?: FindOptionsSelect<T>;
			relations?: FindOptionsRelations<T>;
			manager?: EntityManager;
		},
	): Promise<T | null> {
		const repo = this.getRepo(options?.manager);

		const finalWhere = options?.includeDeleted ? { Id: id } : { Id: id, DeletedAt: IsNull() };

		return await repo.findOne({
			where: finalWhere as FindOptionsWhere<T>,
			select: options?.select && { ...options.select, Id: true },
			relations: options?.relations,
		});
	}

	async findOneBy(
		where: FindOptionsWhere<T>,
		options?: {
			includeDeleted?: boolean;
			select?: FindOptionsSelect<T>;
			relations?: FindOptionsRelations<T>;
			manager?: EntityManager;
		},
	): Promise<T | null> {
		const repo = this.getRepo(options?.manager);

		const finalWhere = options?.includeDeleted ? where : { ...where, DeletedAt: IsNull() };

		return await repo.findOne({
			where: finalWhere,
			select: options?.select && { ...options.select, Id: true },
			relations: options?.relations,
		});
	}

	async findAll(options?: {
		where?: FindOptionsWhere<T>;
		includeDeleted?: boolean;
		select?: FindOptionsSelect<T>;
		relations?: FindOptionsRelations<T>;
		order?: FindOptionsOrder<T>;
		skip?: number;
		take?: number;
		manager?: EntityManager;
	}): Promise<{ items: T[]; totalCount: number }> {
		const repo = this.getRepo(options?.manager);

		const finalWhere = options?.includeDeleted ? options?.where : { ...options?.where, DeletedAt: IsNull() };

		const [items, totalCount] = await repo.findAndCount({
			where: finalWhere as FindOptionsWhere<T>,
			select: options?.select,
			relations: options?.relations,
			order: options?.order,
			skip: options?.skip,
			take: options?.take,
		});

		return { items, totalCount };
	}

	async existsById(stringId: string, stringExcludeId?: string): Promise<boolean> {
		const id = Number(stringId);

		const excludeId = stringExcludeId ? Number(stringExcludeId) : null;

		if (isNaN(id) || (excludeId && isNaN(excludeId))) return false;

		const qb = this.repository.createQueryBuilder("entity").where("entity.Id = :id", { id }).andWhere("entity.DeletedAt IS NULL");

		if (excludeId) {
			qb.andWhere("entity.Id != :excludeId", { excludeId });
		}

		return await qb.getExists();
	}

	async existsBy<K extends keyof T>(field: K, value: T[K], stringExcludeId?: string): Promise<boolean> {
		const excludeId = Number(stringExcludeId);

		const qb = this.repository
			.createQueryBuilder("entity")
			.where(`entity.${String(field)} = :value`, { value })
			.andWhere("entity.DeletedAt IS NULL");

		if (excludeId) {
			qb.andWhere("entity.Id != :excludeId", { excludeId });
		}

		return await qb.getExists();
	}

	// CRUD
	async create(data: T, manager?: EntityManager): Promise<T> {
		return await this.getRepo(manager).save(data);
	}

	async update(id: string, data: T, manager?: EntityManager): Promise<T | null> {
		const repo = this.getRepo(manager);

		return await repo.save(data);
	}

	async delete(stringId: string, manager?: EntityManager): Promise<boolean> {
		const id = Number(stringId);

		if (isNaN(id)) return false;

		const result = await this.getRepo(manager).softDelete(id);
		return result.affected !== 0;
	}
}

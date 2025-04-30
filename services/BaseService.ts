import { ObjectLiteral, Repository } from "typeorm";

export class BaseService<T extends ObjectLiteral> {
	constructor(protected readonly repository: Repository<T>) {}

	async findOne(options: {
		select?: (keyof T)[];
		includeDeleted?: boolean;
		where?: ObjectLiteral;
		relations?: string[];
	}): Promise<Partial<T> | null> {
		const query = this.repository.createQueryBuilder("entity");

		if (!options.includeDeleted) {
			query.where("entity.DeletedAt IS NULL");
		}

		if (options.where) {
			query.andWhere(options.where);
		}

		if (options.relations) {
			options.relations.forEach((relation) => {
				query.leftJoinAndSelect(`entity.${relation}`, relation);
			});
		}

		if (options.select) {
			query.select(options.select.map((field) => `entity.${String(field)}`));
		}

		return await query.getOne();
	}

	async findOneBy<K extends keyof T>(
		field: K,
		value: T[K],
		options?: {
			select?: (keyof T)[];
			includeDeleted?: boolean;
			relations?: string[];
		},
	): Promise<Partial<T> | null> {
		return this.findOne({
			where: { [field]: value } as ObjectLiteral,
			select: options?.select,
			includeDeleted: options?.includeDeleted,
			relations: options?.relations,
		});
	}

	async getEntities(options?: {
		select?: (keyof T)[];
		includeDeleted?: boolean;
		where?: ObjectLiteral;
		relations?: string[];
	}): Promise<Partial<T>[]> {
		const query = this.repository.createQueryBuilder("entity");

		if (!options?.includeDeleted) {
			query.where("entity.DeletedAt IS NULL");
		}

		if (options?.where) {
			query.where(options.where);
		}

		if (options?.relations) {
			options.relations.forEach((relation) => {
				query.leftJoinAndSelect(`entity.${relation}`, relation);
			});
		}

		if (options?.select) {
			query.select(options.select.map((field) => `entity.${String(field)}`));
		}

		return await query.getMany();
	}

	async exists(id: string): Promise<boolean> {
		const result = await this.repository
			.createQueryBuilder("entity")
			.where("entity.Id = :id", { id })
			.andWhere("entity.DeletedAt IS NULL")
			.getExists();

		return result;
	}

	async existsBy<K extends keyof T>(field: K, value: T[K]): Promise<boolean> {
		const result = await this.repository
			.createQueryBuilder("entity")
			.where(`entity.${String(field)} = :value`, { value })
			.andWhere("entity.DeletedAt IS NULL")
			.getExists();

		return result;
	}

	// async getValues<K extends keyof T>(field: K): Promise<T[K][]> {
	// 	const entities = await this.getEntities({ select: [field] });
	// 	return entities.map((e) => e[field]).filter((v): v is T[K] => v !== undefined);
	// }
}

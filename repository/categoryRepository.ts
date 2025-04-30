import { Category } from "../models/database/Category.js";
import { EntityManager, IsNull, Repository } from "typeorm";
import { GetComboItem } from "../types/shared/IGetCombo.js";
import { createValidOrderColumns, getAllPaginationOptions } from "../utils/RepositoryHelpers.js";
import { IGenericGetAllRequest } from "../types/shared/IBaseRequest.js";
import { inject, injectable } from "tsyringe";

@injectable()
export class CategoryRepository {
	constructor(
		@inject("CategoryTypeORMRepository")
		private readonly repository: Repository<Category>,
	) {}

	getRepo = (manager?: EntityManager) => {
		return manager ? manager.getRepository(Category) : this.repository;
	};

	async getAll(query: IGenericGetAllRequest): Promise<{ items: Category[]; totalCount: number }> {
		const validOrderColumns = createValidOrderColumns<Category>(["Name", "CreatedAt"]);

		const { skip, take, order } = getAllPaginationOptions<Category>(query, validOrderColumns);

		const [items, totalCount] = await this.repository.findAndCount({
			where: { DeletedAt: IsNull() },
			select: { Id: true, Name: true, CreatedAt: true },
			order,
			skip,
			take,
		});

		return { items, totalCount };
	}

	async getById(id: string): Promise<Category | null> {
		const categoryId = Number(id);

		if (isNaN(categoryId)) return null;

		const category = await this.repository.findOne({
			where: { Id: categoryId, DeletedAt: IsNull() },
		});

		if (!category) return null;

		return category;
	}

	async getCombo(): Promise<GetComboItem[]> {
		const categories = await this.repository.find({
			select: { Id: true, Name: true },
			where: { DeletedAt: IsNull() },
			order: { Name: "ASC" },
		});

		return categories.map((c) => ({
			id: c.Id!.toString(),
			label: c.Name,
		}));
	}

	async create(category: Category, manager?: EntityManager): Promise<Category> {
		const repo = this.getRepo(manager);
		return await repo.save(category);
	}

	// async update(id: string, data: Partial<Category>): Promise<Category | null> {
	// 	const category = await this.getById(id);
	// 	if (!category) return null;

	// 	Object.assign(category, data);
	// 	return await this.repository.save(category);
	// }

	async delete(id: string, manager?: EntityManager): Promise<boolean | null> {
		const categoryId = Number(id);

		if (isNaN(categoryId)) return null;

		const repo = this.getRepo(manager);
		const result = await repo.softDelete(id);
		return result.affected !== 0;
	}
}

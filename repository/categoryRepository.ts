import { Category } from "../models/database/Category.js";
import { FindOptionsWhere, IsNull, Like, Repository } from "typeorm";
import { GetComboItem } from "../types/shared/IGetCombo.js";
import { createValidOrderColumns, getAllPaginationOptions } from "../utils/RepositoryHelpers.js";
import { IGenericGetAllRequest } from "../types/shared/IBaseRequest.js";
import { inject, injectable } from "tsyringe";
import { BaseRepository } from "./BaseRepository.js";

@injectable()
export class CategoryRepository extends BaseRepository<Category> {
	constructor(
		@inject("CategoryTypeORMRepository")
		private readonly categoryRepository: Repository<Category>,
	) {
		super(Category, categoryRepository);
	}

	buildWhere(query: IGenericGetAllRequest): FindOptionsWhere<Category> | FindOptionsWhere<Category>[] {
		const base: FindOptionsWhere<Category> = { DeletedAt: IsNull() };

		if (query.text) {
			return [{ ...base, Name: Like(`%${query.text}%`) }];
		}

		return base;
	}

	async getAll(query: IGenericGetAllRequest): Promise<{ items: Category[]; totalCount: number }> {
		const validOrderColumns = createValidOrderColumns<Category>(["Name", "CreatedAt"]);

		const { skip, take, order } = getAllPaginationOptions<Category>(query, validOrderColumns);

		const [items, totalCount] = await this.categoryRepository.findAndCount({
			where: this.buildWhere(query),
			select: { Id: true, Name: true, CreatedAt: true },
			order,
			skip,
			take,
		});

		return { items, totalCount };
	}

	async getCombo(): Promise<GetComboItem[]> {
		const categories = await this.categoryRepository.find({
			select: { Id: true, Name: true },
			where: { DeletedAt: IsNull() },
			order: { Name: "ASC" },
		});

		return categories.map((c) => ({
			id: c.Id!.toString(),
			label: c.Name,
		}));
	}
}

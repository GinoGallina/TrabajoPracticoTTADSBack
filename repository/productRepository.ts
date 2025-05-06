import { inject, injectable } from "tsyringe";
import { FindOptionsWhere, In, IsNull, LessThanOrEqual, Like, MoreThan, MoreThanOrEqual, Repository } from "typeorm";
import { Product } from "../models/database/Product.js";
import { IProductGetAllRequest } from "../types/IProduct.js";
import { createValidOrderColumns, getAllPaginationOptions } from "../utils/RepositoryHelpers.js";
import { AuthService } from "../services/AuthService.js";
import { IGenericGetAllRequest } from "../types/shared/IBaseRequest.js";
import { RoleEnum } from "../types/IRole.js";
import { BaseRepository } from "./BaseRepository.js";

@injectable()
export class ProductRepository extends BaseRepository<Product> {
	constructor(
		@inject("ProductTypeORMRepository")
		private readonly productRepository: Repository<Product>,
		@inject("AuthService")
		private readonly authService: AuthService,
	) {
		super(Product, productRepository);
	}

	async getAllMyProducts(query: IGenericGetAllRequest): Promise<{ items: Product[]; totalCount: number }> {
		const validOrderColumns = createValidOrderColumns<Product>(["Name", "Price", "Stock", "CreatedAt"]);

		const { skip, take, order } = getAllPaginationOptions<Product>(query, validOrderColumns);

		const token = this.authService.getToken();

		const whereCondition: FindOptionsWhere<Product> = {
			DeletedAt: IsNull(),
		};

		if (!token.roles.includes(RoleEnum.Admin)) {
			whereCondition.UserId = Number(token.id);
		}

		const [items, totalCount] = await this.productRepository.findAndCount({
			where: whereCondition,
			relations: ["Category"],
			select: { Id: true, Name: true, Description: true, CreatedAt: true, Price: true, Stock: true },
			order,
			skip,
			take,
		});
		return { items, totalCount };
	}

	async getAll(query: IProductGetAllRequest): Promise<{ items: Product[]; totalCount: number }> {
		const validOrderColumns = createValidOrderColumns<Product>(["Name", "Price", "Stock", "CreatedAt"]);

		const { skip, take, order } = getAllPaginationOptions<Product>(query, validOrderColumns);

		const categoryIds = Array.isArray(query.categoryIds) ? query.categoryIds.map(Number) : [Number(query.categoryIds)];

		let priceCondition;

		switch (query.priceOption) {
			case "lte":
				priceCondition = LessThanOrEqual(Number(query.price));
				break;
			case "gte":
				priceCondition = MoreThanOrEqual(Number(query.price));
				break;
			case "eq":
				priceCondition = Number(query.price);
				break;
			default:
				priceCondition = undefined;
				break;
		}

		// Fiter options
		const baseConditions = {
			DeletedAt: IsNull(),
			...(query.categoryIds && query.categoryIds.length > 0 && { Category: { Id: In(categoryIds) } }),
			...{ Stock: query.available === "true" ? MoreThan(0) : MoreThanOrEqual(0) },
			...(query.priceOption && {
				Price: priceCondition,
			}),
		};

		let where;

		if (query.text) {
			where = [
				{ ...baseConditions, Name: Like(`%${query.text}%`) },
				{ ...baseConditions, Description: Like(`%${query.text}%`) },
			];
		} else {
			where = baseConditions;
		}

		const [items, totalCount] = await this.productRepository.findAndCount({
			where,
			relations: ["Category", "Reviews"],
			select: { Id: true, Name: true, Description: true, CreatedAt: true, Price: true, Stock: true },
			order,
			skip,
			take,
		});
		return { items, totalCount };
	}
}

import { inject, injectable } from "tsyringe";
import { EntityManager, In, IsNull, LessThanOrEqual, Like, MoreThan, MoreThanOrEqual, Repository } from "typeorm";
import { Product } from "../models/database/Product.js";
import { IProductCreateRequest, IProductGetAllRequest, IMyProductGetAllRequest } from "../types/IProduct.js";
import { createValidOrderColumns, getAllPaginationOptions } from "../utils/RepositoryHelpers.js";

@injectable()
export class ProductRepository {
	constructor(
		@inject("ProductTypeORMRepository")
		private readonly repository: Repository<Product>,
	) {}

	getRepo = (manager?: EntityManager) => {
		return manager ? manager.getRepository(Product) : this.repository;
	};

	async getAllMyProducts(query: IMyProductGetAllRequest): Promise<{ items: Product[]; totalCount: number }> {
		const validOrderColumns = createValidOrderColumns<Product>(["Name", "Price", "Stock", "CreatedAt"]);

		const { skip, take, order } = getAllPaginationOptions<Product>(query, validOrderColumns);

		const [items, totalCount] = await this.repository.findAndCount({
			where: { DeletedAt: IsNull(), ...(query.userId && { User: { Id: Number(query.userId) } }) },
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

		// TODO ERROR IN query.categoryIds.map(Number)
		// TODO ERROR no anda available false

		const categoryIds = Array.isArray(query.categoryIds) ? query.categoryIds.map(Number) : [Number(query.categoryIds)];

		// Fiter options
		const baseConditions = {
			DeletedAt: IsNull(),
			...(query.categoryIds && query.categoryIds.length > 0 && { Category: { Id: In(categoryIds) } }),
			...(query.available === true && { Stock: MoreThan(0) }),
			...(query.available === false && { Stock: MoreThanOrEqual(0) }),
			...(query.price && {
				Price: query.lessThan === true ? LessThanOrEqual(Number(query.price)) : MoreThanOrEqual(Number(query.price)),
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

		const [items, totalCount] = await this.repository.findAndCount({
			where,
			relations: ["Category"],
			select: { Id: true, Name: true, Description: true, CreatedAt: true, Price: true, Stock: true },
			order,
			skip,
			take,
		});
		return { items, totalCount };
	}

	async getById(id: string): Promise<Product | null> {
		const productId = Number(id);

		if (isNaN(productId)) return null;

		const product = await this.repository.findOne({
			relations: ["Category", "User"],
			where: { Id: productId, DeletedAt: IsNull() },
		});
		if (!product) return null;
		return product;
	}

	async create(product: IProductCreateRequest, manager?: EntityManager): Promise<Product> {
		const repo = this.getRepo(manager);
		const fixedProduct = {
			...product,
			CategoryId: Number(product.CategoryId),
			UserId: Number(product.UserId),
		};
		return await repo.save(fixedProduct);
	}

	// async update(id: string, data: Partial<Product>): Promise<Product | null> {
	// 	const category = await this.getById(id);
	// 	if (!category) return null;

	// 	Object.assign(category, data);
	// 	return await this.repository.save(category);
	// }

	async delete(id: string, manager?: EntityManager): Promise<boolean | null> {
		const productId = Number(id);

		if (isNaN(productId)) return null;

		const repo = this.getRepo(manager);
		const result = await repo.softDelete(id);
		return result.affected !== 0;
	}
}

// import { Product, IProductDocument } from "../models/database/product.js";
// import { IProductRepository } from "../shared/IProductRepository.js";
// import { ProductFilter } from "../types/filters/ProductFilter.js";

// export class ProductRepository implements IProductRepository<IProduct> {
//   public async findAll(filter: ProductFilter): Promise<IProduct[] | undefined> {
//     return await Product.find(filter)
//       .populate("seller", "email state cbu shop_name")
//       .populate("category", "category");
//   }

//   public async findOne(item: { id: string }): Promise<IProduct | undefined> {
//     const _id = new Object(item.id);
//     return (
//       (await Product.findOne({ _id })
//         .populate("seller", "email state cbu shop_name")
//         .populate("category", "category")) || undefined
//     );
//   }

//   public async add(product: IProduct): Promise<IProduct | undefined> {
//     const newProduct: IProductDocument = new Product(product);
//     return await newProduct.save();
//   }

//   public async update(
//     id: string,
//     product: IProduct
//   ): Promise<IProduct | undefined> {
//     return (
//       (await Product.findOneAndUpdate(
//         {
//           _id: id,
//         },
//         product,
//         { new: true }
//       )) || undefined
//     );
//   }

//   public async delete(item: { id: string }): Promise<IProduct | undefined> {
//     return (
//       (await Product.findByIdAndUpdate(
//         { _id: item.id },
//         { state: "Archived" },
//         { new: true }
//       )) || undefined
//     );
//   }
// }

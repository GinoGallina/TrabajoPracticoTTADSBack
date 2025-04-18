import { Category } from "../models/database/Category.js";
import { EntityManager, IsNull, Repository } from "typeorm";

import { ICategoryCreateRequest } from "../types/ICategory.js";
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

	async findByName(name: string, manager?: EntityManager): Promise<Category | null> {
		const repo = this.getRepo(manager);
		const category = await repo.findOne({
			where: { Name: name, DeletedAt: IsNull() },
		});
		if (!category) return null;
		return category;
	}

	async create(category: ICategoryCreateRequest, manager?: EntityManager): Promise<Category> {
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

// import { Category, ICategoryDocument } from "../models/database/category.js";
// import { Repository } from "../shared/repository.js";

// export class CategoryRepository implements Repository<ICategory> {
//   public async findAll(): Promise<ICategory[] | undefined> {
//     return (
//       (await Category.find()
//         .populate({
//           path: "discounts",
//           model: "Discount",
//           select: "_id value state createdAt updatedAt -category",
//         })
//         .sort({ createAt: -1 })) || undefined
//     );
//   }

//   public async findOne(item: { id: string }): Promise<ICategory | undefined> {
//     const _id = new Object(item.id);
//     return (
//       (await Category.findOne({ _id }).populate({
//         path: "discounts",
//         model: "Discount",
//         select: "_id value state createdAt updatedAt -category",
//       })) || undefined
//     );
//   }

//   public async add(category: ICategory): Promise<ICategory | undefined> {
//     const newCategory: ICategoryDocument = new Category(category);
//     return await newCategory.save();
//   }

//   public async update(
//     id: string,
//     category: ICategory
//   ): Promise<ICategory | undefined> {
//     return (
//       (await Category.findByIdAndUpdate(
//         {
//           _id: id,
//           state: "Active",
//         },
//         category,
//         { new: true }
//       )) || undefined
//     );
//   }

//   public async delete(item: { id: string }): Promise<ICategory | undefined> {
//     return (
//       (await Category.findByIdAndUpdate(
//         { _id: item.id },
//         { state: "Archived" },
//         { new: true }
//       )) || undefined
//     );
//   }
// }

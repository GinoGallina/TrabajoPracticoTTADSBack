import { Category } from "../models/database/Category.js";
import { EntityManager, IsNull, Repository } from "typeorm";
import { CategoryCreateRequestSchema } from "../schemas/category.js";

export class CategoryRepository {
	constructor(private readonly repository: Repository<Category>) {}

	async getAll(): Promise<Category[]> {
		return await this.repository.find({
			where: { DeletedAt: IsNull() },
		});
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

	async findByName(
		name: string,
		manager?: EntityManager,
	): Promise<Category | null> {
		const repo = manager
			? manager.getRepository(Category)
			: this.repository;
		const category = await repo.findOne({
			where: { Name: name, DeletedAt: IsNull() },
		});
		if (!category) return null;
		return category;
	}

	async create(
		category: CategoryCreateRequestSchema,
		manager?: EntityManager,
	): Promise<Category> {
		const repo = manager
			? manager.getRepository(Category)
			: this.repository;
		return await repo.save(category);
	}

	async update(
		id: string,
		data: Partial<Category>,
	): Promise<Category | null> {
		const category = await this.getById(id);
		if (!category) return null;

		Object.assign(category, data);
		return await this.repository.save(category);
	}

	async delete(id: number): Promise<boolean> {
		const result = await this.repository.softDelete(id);
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

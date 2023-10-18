import { Category, ICategoryDocument } from "../models/database/category.js"
import { Repository } from "../shared/repository.js"

export class CategoryRepository implements Repository<ICategory> {
  public async findAll(): Promise<ICategory[] | undefined> {
    return await Category.find({ state: 'Active' })
  }
  
 public async findOne(item: { id: string }): Promise<ICategory | undefined> {
    const _id = new Object(item.id)
    return (await Category.findOne({ _id })) || undefined
  }
  
  public async add(category: ICategory): Promise<ICategory | undefined> {
    const newCategory: ICategoryDocument = new Category(category)
    return await newCategory.save()
  }

  public async update(id: string, category: ICategory): Promise<ICategory | undefined> {
    return await Category.findOneAndUpdate({
        _id: id,
        state: 'Active'
      },
        category,
        { new: true }) || undefined
  }

  public async delete(item: { id: string }): Promise<ICategory | undefined> {
    return await Category.findByIdAndUpdate(
        { _id: item.id },
        { state: 'Archived' },
        { new: true }) || undefined
  }

}

import { Product, IProductDocument } from "../models/database/product.js"
import { IProductRepository } from "../shared/IProductRepository.js"

export class ProductRepository implements IProductRepository<IProduct> {
  public async findAll(): Promise<IProduct[] | undefined> {
    return await Product.find()
                        .populate("seller",'email state cbu shop_name')
                        .populate("category", "category");
  }
  
 public async findOne(item: { id: string }): Promise<IProduct | undefined> {
    const _id = new Object(item.id)
    return (await Product.findOne({ _id })
                        .populate("seller",'email state cbu shop_name')
                        .populate("category", "category"))|| undefined
  }
  
  public async add(product: IProduct): Promise<IProduct | undefined> {
    const newProduct: IProductDocument = new Product(product)
    return await newProduct.save()
  }

  public async update(id: string, product: IProduct): Promise<IProduct | undefined> {
    return await Product.findOneAndUpdate({
        _id: id,
        state: 'Active'
      },
        product,
        { new: true }) || undefined
  }

  public async delete(item: { id: string }): Promise<IProduct | undefined> {
    return await Product.findByIdAndUpdate(
        { _id: item.id },
        { state: 'Archived' },
        { new: true }) || undefined
  }

}

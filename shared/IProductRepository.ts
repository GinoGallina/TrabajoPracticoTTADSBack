import { ProductFilter } from "../types/filters/ProductFilter.js";

export interface IProductRepository<IProduct> {
  findAll(filter: ProductFilter): Promise<IProduct[] | undefined>;
  findOne(item: { id: string }): Promise<IProduct | undefined>;
  add(item: IProduct): Promise<IProduct | undefined>;
  update(id: string, item: IProduct): Promise<IProduct | undefined>;
  delete(item: { id: string }): Promise<IProduct | undefined>;
}

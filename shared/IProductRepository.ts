export interface IProductRepository<IProduct> {
  findAll(): Promise<IProduct[] | undefined>
  findOne(item: { id: string }): Promise<IProduct | undefined>
  add(item: IProduct): Promise<IProduct | undefined>
  update(id: string, item: IProduct): Promise<IProduct | undefined>
  delete(item: { id: string }): Promise<IProduct | undefined>
}

export interface ICartRepository<ICart> {
  findCartByMember(item: { id: string }): Promise<ICart | undefined>;
  addOrder(order: IOrder): Promise<IOrder | undefined>;
  completeBuy(): Promise<ICart | undefined>;
  create(): Promise<ICart | undefined>;
}

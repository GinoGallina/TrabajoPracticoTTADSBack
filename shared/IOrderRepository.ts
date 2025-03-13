import { ClientSession } from "mongoose";

export interface IOrderRepository<IOrder> {

  add(item: IOrder): Promise<IOrder | undefined>;
  update(id: string, item: IOrder): Promise<IOrder| undefined>;
  delete(item: { id: string }): Promise<string | undefined>;
  updateAll(cartId: string, state: string, session: ClientSession): Promise<boolean | undefined>;
}

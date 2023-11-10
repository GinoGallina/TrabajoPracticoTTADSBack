import IOrder from "../types/IOrder";
import { CartFilter } from "../types/filters/CartFilter";

export interface ICartRepository<ICart> {
  findCartByMember(filter: CartFilter): Promise<ICart | undefined>;
  addOrder(order: IOrder): Promise<IOrder | undefined>;
  completeBuy(): Promise<ICart | undefined>;
  create(): Promise<ICart | undefined>;
}

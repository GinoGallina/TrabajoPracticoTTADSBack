import { Cart, ICartDocument } from "../models/database/cart.js";
import { ICartRepository } from "../shared/ICartRepository.js";
import ICart from "../types/ICart.js";
import { ClientSession } from "mongoose";
export class CartRepository implements ICartRepository<ICart> {
  public async findByIdAndUpdate(
    id: string,
    status: { status: string },
    session: { session: ClientSession }
  ) {
    throw new Error("Method not implemented.");
  }
  public async findCartByMember(item: {
    id: string;
    state: string;
  }): Promise<ICart | undefined> {
    return;
  }

  public async addOrder(order: IOrder): Promise<IOrder | undefined> {
    return;
  }

  public async create(): Promise<ICart | undefined> {
    const newCart: ICartDocument = new Cart();
    return await newCart.save();
  }
  public async completeBuy(): Promise<ICart | undefined> {
    return;
  }
}

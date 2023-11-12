import { Cart, ICartDocument } from "../models/database/cart.js";
import { ICartRepository } from "../shared/ICartRepository.js";
import ICart from "../types/ICart.js";
import { ClientSession } from "mongoose";
import { CartFilter } from "../types/filters/CartFilter.js";
import IOrder from "../types/IOrder.js";
export class CartRepository implements ICartRepository<ICart[] | undefined> {
  public async findByIdAndUpdate(
    id: string,
    status: { status: string },
    session: { session: ClientSession }
  ) {
    throw new Error("Method not implemented.");
  }

  public async findCartByMember(
    filter: CartFilter
  ): Promise<ICart[] | undefined> {
    return (
      (await Cart.find({ user: filter.user, state: filter.state })
        .populate({
          path: "orders",
          model: "Order",
          populate: [
            { path: "product", model: "Product" },
            { path: "shipment", model: "Shipment" },
          ],
        })
        .populate("user")
        .populate("payment_type")) || undefined
    );
  }

  public async addOrder(order: IOrder): Promise<IOrder | undefined> {
    return;
  }

  public async create(): Promise<any | undefined> {
    const newCart: ICartDocument = new Cart();
    return await newCart.save();
  }
  public async completeBuy(): Promise<any | undefined> {
    return;
  }
}

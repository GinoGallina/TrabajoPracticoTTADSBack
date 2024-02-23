import mongoose from "mongoose";
import { CartRepository } from "../repository/cartRepository.js";
import ICart from "../types/ICart.js";
import IOrder from "../types/IOrder.js";
import { OrderService } from "./orderService.js";

const cartRepository = new CartRepository();

//const orderRepository = new OrderRepository();
type ServiceResult<T> = {
  success: boolean;
  data?: T;
  message?: string;
};

export const CartServices = {
  create: async (
    orders: IOrder[],
    user_id: string | string[]
  ): Promise<ServiceResult<IOrder | void>> => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const cart = (await cartRepository.create({ session })) as ICart;

      for (const order of orders) {
        order.cart = cart.id;
        const result = await OrderService.create(order, { session });
        if (!result.success) {
          await session.abortTransaction();
          return {
            success: false,
            message: result.message,
          };
        }
      }

      await session.commitTransaction();
      return {
        success: true,
        message: "orders_created",
      };
    } catch (error) {
      await session.abortTransaction();
      return {
        success: false,
        message: "failed_creating_orders",
      };
    } finally {
      session.endSession();
    }
  },
};

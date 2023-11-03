import mongoose from "mongoose";
import { CartRepository } from "../repository/cartRepository.js";
import ICart from "../types/ICart.js";

const cartRepository = new CartRepository();
//const orderRepository = new OrderRepository();
type ServiceResult<T> = {
  success: boolean;
  data?: T;
  message?: string;
};

export const CartServices = {
  create: async (
    order: IOrder,
    user_id: string
  ): Promise<ServiceResult<IOrder | void>> => {
    const result = await findOrCreateCart(user_id);
    if (result instanceof Error) {
      return {
        success: false,
        message: result.message,
      };
    }
    order.cart = result._id;
    return {
      success: true,
      data: order,
    };
  },

  complete: async (user_id: string): Promise<ServiceResult<IOrder | Error>> => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const cart = await cartRepository.findCartByMember({
        id: user_id,
        state: "Pending",
      });
      if (!cart) {
        return {
          success: false,
          message: "Cart not found",
        };
      }

      await cartRepository.findByIdAndUpdate(
        cart.id,
        { status: "completed" },
        { session }
      );

      //await orderRepository.updateOrders(cart.id,completed,session);

      await session.endSession();
      return {
        success: true,
        message: "Cart is completed",
      };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw new Error("An error occurred");
    }
  },
};

const findOrCreateCart = async (id: string): Promise<ICart | Error> => {
  try {
    const cart = await cartRepository.findCartByMember({
      id,
      state: "Pending",
    });
    if (!cart) {
      const cart = (await cartRepository.create()) as ICart;
      return cart;
    }
    return cart;
  } catch (error) {
    throw new Error("Failed Creating cart");
  }
};

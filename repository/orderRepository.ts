// import { Order, IOrderDocument } from "../models/database/order.js";
// import { IOrderRepository } from "../shared/IOrderRepository.js";
// import { ClientSession, now } from "mongoose";
// import IOrder from "../types/IOrder.js";

// export class OrderRepository implements IOrderRepository<IOrder> {
//   public async add(order: IOrder): Promise<IOrder | undefined> {
//     const newORder: IOrderDocument = new Order(order);
//     return await newORder.save();
//   }

//   public async update(id: string, order: IOrder): Promise<IOrder | undefined> {
//     return (
//       (await Order.findOneAndUpdate(
//         {
//           _id: id,
//         },
//         order,
//         { new: true }
//       )) || undefined
//     );
//   }

//   public async delete(item: { id: string }): Promise<IOrder | undefined> {
//     return (await Order.findOneAndDelete({ _id: item.id })) || undefined;
//   }

//   public async updateAll(
//     cartId: string,
//     state: string,
//     session: ClientSession
//   ): Promise<boolean | undefined> {
//     const resp = await Order.updateMany(
//       { cartId: cartId },
//       { state: state, completedAt: now().getDate() },
//       { new: true, session: session }
//     );
//     return resp.acknowledged || undefined;
//   }
// }

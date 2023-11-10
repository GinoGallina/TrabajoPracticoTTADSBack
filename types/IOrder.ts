import { Document } from "mongoose";
import ICart from "./ICart";

interface IOrder extends Document {
  product: IProduct;
  quantity: number;
  amount: number;
  shipment?: IShipment;
  cart: ICart;
  state: "Pending" | "Completed" | "Cancelled";
  unitPrice: number;
  completedAt?: Date;
}

export default IOrder;

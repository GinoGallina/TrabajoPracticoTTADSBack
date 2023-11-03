import IPaymentType from "./IPaymentType";
import { Document } from "mongoose";

interface ICart extends Document {
  state: "Pending" | "Completed";
  orders: IOrder[];
  user: IUser;
  paymentType: IPaymentType;
  createdAt: Date;
  updatedAt: Date;
}

export default ICart;

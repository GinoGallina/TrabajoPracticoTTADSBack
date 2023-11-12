import IPaymentType from "./IPaymentType";
import { Document } from "mongoose";

interface ICart extends Document {
  state: "Pending" | "Completed";
  user: IUser;
  paymentType: IPaymentType;
  createdAt: Date;
  updatedAt: Date;
}

export default ICart;

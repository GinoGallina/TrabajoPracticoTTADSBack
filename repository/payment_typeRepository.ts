import { Repository } from "../shared/repository.js";
import {
  PaymentType,
  IPaymentTypeDocuemnt,
} from "../models/database/payment_type.js";
import IPaymentType from "../types/IPaymentType.js";

export class PaymentTypeRepository implements Repository<IPaymentType> {
  public async findAll(): Promise<IPaymentType[] | undefined> {
    return await PaymentType.find({ state: "Active" });
  }

  public async findOne(item: {
    id: string;
  }): Promise<IPaymentType | undefined> {
    const _id = new Object(item.id);
    return (await PaymentType.findOne({ _id })) || undefined;
  }

  public async add(
    paymentType: IPaymentType,
  ): Promise<IPaymentType | undefined> {
    const newPaymentType: IPaymentTypeDocuemnt = new PaymentType(paymentType);
    return await newPaymentType.save();
  }

  public async update(
    id: string,
    paymentType: IPaymentType,
  ): Promise<IPaymentType | undefined> {
    return (
      (await PaymentType.findOneAndUpdate(
        {
          _id: id,
          state: "Active",
        },
        paymentType,
        { new: true },
      )) || undefined
    );
  }

  public async delete(item: { id: string }): Promise<IPaymentType | undefined> {
    return (
      (await PaymentType.findByIdAndUpdate(
        { _id: item.id },
        { state: "Archived" },
        { new: true },
      )) || undefined
    );
  }
}

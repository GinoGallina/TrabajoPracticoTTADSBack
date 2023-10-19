import { Discount, IDiscountDocument } from "../models/database/discount.js";
import { Repository } from "../shared/repository.js";
import IDiscount from "../types/IDiscount.js";

export class DiscountReposirory implements Repository<IDiscount> {
  public async findAll(): Promise<IDiscount[] | undefined> {
    return await Discount.find({ state: "active" }).populate("category");
  }

  public async findOne(item: { id: string }): Promise<IDiscount | undefined> {
    const _id = new Object(item.id);
    return (await Discount.findOne({ _id }).populate("category")) || undefined;
  }

  public async add(discount: IDiscount): Promise<IDiscount | undefined> {
    const newDiscount: IDiscountDocument = new Discount(discount);
    return await newDiscount.save();
  }

  public async update(
    id: string,
    discount: IDiscount
  ): Promise<IDiscount | undefined> {
    return (
      (await Discount.findOneAndUpdate(
        {
          _id: id,
          state: "Active",
        },
        discount,
        { new: true }
      )) || undefined
    );
  }
  public async delete(item: { id: string }): Promise<IDiscount | undefined> {
    return (
      (await Discount.findByIdAndUpdate(
        { _id: item.id },
        { state: "Archived" },
        { new: true }
      )) || undefined
    );
  }
}

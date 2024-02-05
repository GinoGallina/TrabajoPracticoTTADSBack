import { isValidObjectId } from "mongoose";
import { User, IUserDocument } from "../models/database/user.js";
import { IUserRepository } from "../shared/IUserRepository.js";
import { UserFilter } from "../types/filters/UserFilter.js";
import { ILoginAuth0 } from "../types/Auth0Token.js";

export class UserRepository implements IUserRepository<IUser> {
  public async findAll(filters: UserFilter): Promise<IUser[] | undefined> {
    return await User.find(
      filters,
      "email address state type cbu shop_name cuit"
    );
  }

  public async findByEmail(email: string): Promise<IUser | undefined> {
    return (
      (await User.findOne(
        { email },
        "_id email username type address state"
      )) || undefined
    );
  }

  public async findOne(item: { id: string }): Promise<IUser | undefined> {
    if (!isValidObjectId(item.id)) return;
    return (
      (await User.findOne(
        { _id: item.id },
        "email address state type cbu shop_name cuit"
      )) || undefined
    );
  }

  public async add(user: IUser | ILoginAuth0): Promise<IUser | undefined> {
    const newUser: IUserDocument = new User(user);
    return await newUser.save();
  }

  public async update(id: string, user: IUser): Promise<IUser | undefined> {
    return (
      (await User.findOneAndUpdate({ _id: id }, user, { new: true })) ||
      undefined
    );
  }

  public async delete(item: { id: string }): Promise<IUser | undefined> {
    return (
      (await User.findOneAndUpdate(
        { _id: item.id },
        { state: "Disable" },
        { new: true }
      )) || undefined
    );
  }

  public async activate(item: { id: string }): Promise<IUser | undefined> {
    return (
      (await User.findOneAndUpdate(
        { _id: item.id },
        { state: "Active" },
        { new: true },
      )) || undefined
    );
  }
}

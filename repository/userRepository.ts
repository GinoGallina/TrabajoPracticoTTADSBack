import  {User, IUserDocument } from "../models/database/user.js"
import { IUserRepository } from "../shared/IUserRepository.js";
import { UserFilter } from "../types/filters/UserFilter.js";

export class UserRepository implements IUserRepository<IUser> {

  public async findAll(filters: UserFilter): Promise<IUser[] | undefined> {

    return await User.find(filters, '-_id email address userId state type cbu shop_name cuit');
  }
  
 public async findOne(item: { id: string }): Promise<IUser | undefined> {
    const _id = new Object(item.id)
    return ( await User.findOne({ userId: _id }, '-_id email address userId state type cbu shop_name cuit')) || undefined
  }
  
  public async add(user: IUser): Promise<IUser | undefined> {
    const newUser: IUserDocument = new User(user)
    return await newUser.save()
  }

  public async update(id: string, user: IUser): Promise<IUser | undefined> {
    return await User.findOneAndUpdate(
        { userId: id },
        user,
        { new: true }
      )|| undefined
  }

  public async delete(item: { id: string }): Promise<IUser | undefined> {
    return await User.findOneAndUpdate(
        { userId: item.id },
        { state: 'Disable' },
        { new: true })|| undefined
  }

}

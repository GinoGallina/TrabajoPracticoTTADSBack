import  {User, IUserDocument } from "../models/database/user.js"
import { Repository } from "../shared/repository.js"

export class UserRepository implements Repository<IUser> {

  public async findAll(): Promise<IUser[] | undefined> {
    return await User.find({}, '-_id email address userId state type');
  }
  
 public async findOne(item: { id: string }): Promise<IUser | undefined> {
    const _id = new Object(item.id)
    return ( await User.findOne({ userId: _id }, '-_id email address userId state type')) || undefined
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

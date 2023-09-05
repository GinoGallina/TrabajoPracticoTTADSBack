interface IUser extends Document {
  userId: string;
  username: string;
  email: string;
  type: string;
  password: string;
  address: string;
  state: string;
  createdAt: Date;
  updatedAt: Date;
}
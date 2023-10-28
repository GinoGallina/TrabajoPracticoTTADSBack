import { default as bcrypt } from "bcryptjs";
import { Request, Response } from "express";
import { User } from "../models/database/user.js";

export const loginController = {
  loginUser: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ error: "Incorrect password" });
      }

      const userResponse: IUserResponse = {
        email: user.email,
        username: user.username,
        type: user.type,
        address: user.address,
        state: user.state,
      };

      res.status(200).json({ user: userResponse });
    } catch (error) {
      res.status(500).json({ error: "Error during login" });
    }
  },
};

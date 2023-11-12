import { default as bcrypt } from "bcryptjs";
import { Request, Response } from "express";
import { User } from "../models/database/user.js";
import TokenManager from "../config/token.js";

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
        _id: user._id,
        email: user.email,
        username: user.username,
        type: user.type,
        address: user.address,
        state: user.state,
      };
      const secret: string | undefined = process.env.SECRET_KEY;
      if (!secret) {
        return res.status(500).json({ error: "Error during login" });
      }

      const tokenManager = new TokenManager(); // Usa tu secreto
      const token = tokenManager.generateToken(userResponse, "3h"); // Genera el token

      res.status(200).json(token);
    } catch (error) {
      res.status(500).json({ error: "Error during login" });
    }
  },
};

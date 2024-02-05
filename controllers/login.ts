import { default as bcrypt } from "bcryptjs";
import { Request, Response } from "express";
import { User } from "../models/database/user.js";
import TokenManager from "../config/token.js";
import { UserRepository } from "../repository/userRepository.js";
import { ILoginAuth0 } from "../types/Auth0Token.js";

const userRepository = new UserRepository();
const tokenManager = new TokenManager();

export const loginController = {
  loginWithAuth0: async (req: Request, res: Response) => {
    const { id_token } = req.body;
    const auth0User = tokenManager.decodeAuth0Token(id_token);
    if (!auth0User) {
      return res.status(404).json({ error: "Token Not Found" });
    }

    const user = await userRepository.findByEmail(auth0User.email);
    if (!user) {
      const commonUser: ILoginAuth0 = {
        email: auth0User.email,
        username: auth0User.nickname,
        type: "User",
        address: "algun lado",
        state: "Active",
      };
      const user = await userRepository.add(commonUser);
      if (!user) {
        res.status(500).json({ error: user });
      }
      const userResponse: IUserResponse = {
        email: user?.email,
        username: user?.username,
        type: user?.type,
        address: user?.address,
        state: user?.state,
      };
      const token = tokenManager.generateToken(userResponse, "3h");
      res.status(200).json(token);
    }
    const userResponse: IUserResponse = {
      email: user?.email,
      username: user?.username,
      type: user?.type,
      address: user?.address,
      state: user?.state,
    };
    const token = tokenManager.generateToken(userResponse, "3h");
    res.status(200).json(token);
  },

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

      const token = tokenManager.generateToken(userResponse, "3h");

      res.status(200).json(token);
    } catch (error) {
      res.status(500).json({ error: "Error during login" });
    }
  },
};

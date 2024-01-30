import { Request, Response } from "express";
import { default as bcrypt } from "bcryptjs";
import { validatePartialUserUpdate, validateUser } from "../schemas/user.js";
import { UserRepository } from "../repository/userRepository.js";
import { UserFilter } from "../types/filters/UserFilter.js";

const userRepository = new UserRepository();

const userController = {
  getAllUsers: async (req: Request, res: Response) => {
    try {
      const filter: UserFilter = req.query as UserFilter;
      const users = await userRepository.findAll(filter);
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: "Error getting Users" });
    }
  },

  getUserById: async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const user = await userRepository.findOne({ id });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: "Error getting User" });
    }
  },

  createUser: async (req: Request, res: Response) => {
    try {
      const result = validateUser(req.body);
      if (!result.success) {
        const errorMessage = result.error?.message;
        if (errorMessage) {
          return res.status(400).json({ error: JSON.parse(errorMessage) });
        } else {
          return res.status(400).json({ error: "Unexpected Error" });
        }
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(
        result.data.password,
        saltRounds
      );
      result.data.password = hashedPassword;
      const user: IUser | undefined = await userRepository.add(result.data);
      if (!user) {
        return res.status(500).json({ error: "Error creating user." });
      }

      const responseData: any = {
        email: user.email,
        username: user.username,
        type: user.type,
        state: user.state,
        address: user.address,
      };
      res.status(201).json({ message: "User created", data: responseData });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An unexpected error occurred." });
    }
  },

  updateUserById: async (req: Request, res: Response) => {
    try {
      const result = validatePartialUserUpdate(req.body);

      if (!result.success) {
        const errorMessage = result.error?.message;
        if (errorMessage) {
          return res.status(400).json({ error: JSON.parse(errorMessage) });
        } else {
          return res.status(400).json({ error: "Unexpected Error" });
        }
      }
      if (result.data.password) {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(
          result.data.password,
          saltRounds
        );
        result.data.password = hashedPassword;
      }

      const updatedUser = await userRepository.update(
        req.params.id,
        result.data
      );
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: "Error updating user" });
    }
  },

  deleteUserById: async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const updatedUser = await userRepository.delete({ id });
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json({ message: "User deleted" });
    } catch (error) {
      res.status(500).json({ error: "Error deleting user" });
    }
  },
};

export default userController;

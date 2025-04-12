import { Router } from "express";
import { DataSource } from "typeorm";
import { AuthController } from "../controllers/AuthController.js";
import { AuthService } from "../services/AuthService.js";
import { UserRepository } from "../repository/UserRepository.js";
import { User } from "../models/database/User.js";
import { UserService } from "../services/UserService.js";
import { Role } from "../models/database/Role.js";

export const AuthRouter = (db: DataSource) => {
	const router = Router();
	const roleRepository = db.getRepository(Role);
	const userService = new UserService(db, new UserRepository(db.getRepository(User), roleRepository), roleRepository);

	const authService = new AuthService(db, userService, roleRepository);
	const authController = new AuthController(authService);

	router.post("/login", authController.login.bind(authController));
	router.post("/register", authController.register.bind(authController));

	return router;
};

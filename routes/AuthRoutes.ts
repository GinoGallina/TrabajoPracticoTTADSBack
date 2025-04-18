import { Router } from "express";
import { container } from "tsyringe";
import { AuthController } from "../controllers/AuthController.js";

export const AuthRouter = () => {
	const router = Router();

	const authController = container.resolve(AuthController);

	router.post("/login", authController.login.bind(authController));
	router.post("/register", authController.register.bind(authController));

	return router;
};

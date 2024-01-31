import { Router } from "express";
import { loginController } from "../controllers/login.js";
const loginRouter = Router();

loginRouter.post("/", loginController.loginUser);
loginRouter.post("/authO", loginController.loginWithAuth0);

export default loginRouter;

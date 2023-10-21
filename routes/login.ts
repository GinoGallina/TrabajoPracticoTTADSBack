import { Router } from 'express';
import { loginController } from '../controllers/login.js';
const loginRouter = Router();

loginRouter.post('/', loginController.loginUser);

export default loginRouter;

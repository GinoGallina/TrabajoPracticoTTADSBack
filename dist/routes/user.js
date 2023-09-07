import { Router } from 'express';
import userController from '../controllers/user.js';
const userRouter = Router();
userRouter.get('/', userController.getAllUsers);
userRouter.post('/', userController.createUser);
userRouter.post('/login', userController.loginUser);
userRouter.get('/:id', userController.getUserById);
userRouter.delete('/:id', userController.deleteUserById);
userRouter.put('/:id', userController.updateUserById);
export default userRouter;
//# sourceMappingURL=user.js.map
import { Router } from 'express'
import authenticateToken from '../controllers/auth.js';
export const authRouter = Router();

authRouter.post('/validate-token',authenticateToken, (req,res)=>{return res.status(200).json({ message: 'Token válido',user:req.user })});

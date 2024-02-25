import {authenticateTokenFunction} from "../controllers/auth.js";
import { Request, Response, NextFunction } from "express";


declare global {
  namespace Express {
    interface Request {
      user?: Record<string, any>;
    }
  }
}


export const adminMiddleware = (req:Request, res:Response, next:NextFunction)=>{
    const token: string | undefined = req
      .header("Authorization")
      ?.replace("Bearer ", "");
    const rta = authenticateTokenFunction(token);
    console.log(rta)
    if(rta.status && rta.data.type=='Admin'){
        req.user=rta.data
        next();
    }else if(rta.status && rta.data.type!='ADMIN'){
        return res.status(401).json({message:'No es Admin'})
    }
    else{
        return res.status(rta.statusCode as number).json(rta.message)
    }

}
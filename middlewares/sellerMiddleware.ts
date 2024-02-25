
import {authenticateTokenFunction} from "../controllers/auth.js";
import { Request, Response, NextFunction } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: Record<string, any>;
    }
  }
}


export const sellerMiddleware = (req:Request, res:Response, next:NextFunction)=>{
    const token: string | undefined = req
      .header("Authorization")
      ?.replace("Bearer ", "");
    const rta = authenticateTokenFunction(token);
    console.log(rta)
    if(rta.status && rta.data.type=='Seller'){
        req.user=rta.data
        next();
    }else if(rta.status && rta.data.type!='Seller'){
        return res.status(401).json({message:'No es vendedor'})
    }
    else{
        return res.status(rta.statusCode as number).json(rta.message)
    }

}
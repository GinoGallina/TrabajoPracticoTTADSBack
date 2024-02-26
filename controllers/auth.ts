import { Request, Response, NextFunction } from "express";
import TokenManager from "../config/token.js";
import { auth } from "express-oauth2-jwt-bearer";
import { boolean } from "zod";

// Extiende la interfaz Request para agregar la propiedad 'user'


// const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const token: string | undefined = req
//       .header("Authorization")
//       ?.replace("Bearer ", "");
//     if (!token) {
//       return res.status(401).json({ error: "Token no presente" });
//     }
//     const secret: string | undefined = process.env.SECRET_KEY;
//     if (!secret) {
//       return res.status(500).json({
//         error: "Error interno del servidor, no está el secreto del jwt",
//       });
//     }

//     const tokenManager = new TokenManager();
//     const decoded = tokenManager.verifyToken(token);

//     if (!decoded) {
//       return res.status(401).json({ error: "Token de autenticación inválido" });
//     }

//     const tokenExpiration = decoded.exp; // Obtiene la fecha de expiración del token en segundos

//     // Verifica si el token ha expirado
//     if (Date.now() >= tokenExpiration * 1000) {
//       return res.status(401).json({ error: "Token expirado" });
//     }

//     req.user = decoded;
//     console.log(req.user);
//     // Continúa con la siguiente función de middleware o enrutador
//     next();
//   } catch (error) {
//     console.log(error);

//     return res.status(500).json({ error: "Error interno del servidor" });
//   }
// };

export const authenticateTokenFunction = (token:string | undefined) => {
  const response:{status:boolean,message:string,data:any,statusCode:number | null} ={
    status: false,
    message:'',
    data:null,
    statusCode:null
  }
  try {

    if (!token) {
      response.status=false;
      response.message='Token no presente';
      response.statusCode=401;
      return response
    }
    const secret: string | undefined = process.env.SECRET_KEY;
    if (!secret) {
      response.status=false;
      response.message='Error interno del servidor, no está el secreto del jwt';
      response.statusCode=500;
      return response
    }
    
    const tokenManager = new TokenManager();
    const decoded = tokenManager.verifyToken(token);
    
    if (!decoded) {
      response.status=false;
      response.message='Token de autenticación inválido';
      response.statusCode=401;
      return response
    }
    
    const tokenExpiration = decoded.exp; // Obtiene la fecha de expiración del token en segundos
    
    // Verifica si el token ha expirado
    if (Date.now() >= tokenExpiration * 1000) {
      response.status=false;
      response.message='Token expirado';
      response.statusCode=401;
      return response
    }
    
    console.log(decoded)

    response.data=decoded;
    response.status=true;
    response.message='Token Válido';
    
    // req.user = decoded;
    
    // Continúa con la siguiente función de middleware o enrutador
    return response
  } catch (error) {
    console.log(error);
    response.status=false;
    response.message='Error interno del servidor';
    response.statusCode=500;
    return response
    
  }
};


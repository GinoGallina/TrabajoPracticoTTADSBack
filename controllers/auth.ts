import { Request, Response, NextFunction } from 'express';
import TokenManager from '../config/token.js';



// Extiende la interfaz Request para agregar la propiedad 'user'
declare global {
    namespace Express {
        interface Request {
            user?: Record<string, any>;
        }
    }
}

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {

    try {
        const token:string|undefined = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({error:'Token no presente'});
        }
        const secret: string | undefined = process.env.SECRET_KEY;
        if (!secret) {
            return res.status(500).json({error:'Error interno del servidor, no está el secreto del jwt'});
        }

        const tokenManager = new TokenManager(secret);
        const decoded = tokenManager.verifyToken(token);

        if (!decoded) {
            return res.status(401).json({error:'Token de autenticación inválido'});
        }

        const tokenExpiration = decoded.exp; // Obtiene la fecha de expiración del token en segundos

        // Verifica si el token ha expirado
        if (Date.now() >= tokenExpiration * 1000) {
            return res.status(401).json({error:'Token expirado'});
        }

        req.user = decoded;
        console.log(req.user)
        // Continúa con la siguiente función de middleware o enrutador
        next();
        
    } catch (error) {
        console.log(error);

        return res.status(500).json({error:'Error interno del servidor'});
    }
}

export default authenticateToken;

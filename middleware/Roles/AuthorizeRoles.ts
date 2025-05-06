import { Request, Response, NextFunction } from "express";

export const authorizeRoles = (...allowedRoles: string[]) => {
	return (req: Request, res: Response, next: NextFunction) => {
		const userRoles = req.auth?.roles;

		if (!userRoles || !Array.isArray(userRoles)) {
			return res.status(403).json({ message: "No autorizado: sin roles." });
		}

		const hasAccess = userRoles.some((role: string) => allowedRoles.includes(role));
		if (!hasAccess) {
			return res.status(403).json({ message: "No tienes permisos para acceder a este recurso." });
		}

		next();
	};
};

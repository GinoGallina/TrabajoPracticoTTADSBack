import { authorizeRoles } from "../middleware/Roles/AuthorizeRoles.js";
import { Request, Response, NextFunction } from "express";

describe("authorizeRoles middleware", () => {
	let req: Partial<Request>;
	let res: Partial<Response>;
	let next: NextFunction;

	beforeEach(() => {
		req = {};
		res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		};
		next = jest.fn();
	});

	it("debería responder 403 si no hay roles", () => {
		req.auth = undefined;

		const middleware = authorizeRoles("Admin");
		middleware(req as Request, res as Response, next);

		expect(res.status).toHaveBeenCalledWith(403);
		expect(res.json).toHaveBeenCalledWith({ message: "No autorizado: sin roles." });
		expect(next).not.toHaveBeenCalled();
	});

	it("debería responder 403 si roles no tienen permiso", () => {
		req.auth = { roles: ["User"] };

		const middleware = authorizeRoles("Admin");
		middleware(req as Request, res as Response, next);

		expect(res.status).toHaveBeenCalledWith(403);
		expect(res.json).toHaveBeenCalledWith({ message: "No tienes permisos para acceder a este recurso." });
		expect(next).not.toHaveBeenCalled();
	});

	it("debería llamar next si roles tienen permiso", () => {
		req.auth = { roles: ["Admin", "User"] };

		const middleware = authorizeRoles("Admin");
		middleware(req as Request, res as Response, next);

		expect(next).toHaveBeenCalled();
		expect(res.status).not.toHaveBeenCalled();
		expect(res.json).not.toHaveBeenCalled();
	});
});

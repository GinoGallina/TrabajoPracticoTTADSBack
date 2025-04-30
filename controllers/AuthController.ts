import { Request, Response } from "express";
import { AuthService } from "../services/AuthService.js";
import { ILoginRequest, IRegisterRequest } from "../types/IAuth.js";
import { inject, injectable } from "tsyringe";
@injectable()
export class AuthController {
	constructor(@inject("AuthService") private readonly authService: AuthService) {}

	login = async (req: Request<ILoginRequest>, res: Response) => {
		const response = await this.authService.login(req.body);
		res.status(response.success ? 200 : (response.error?.code ?? 500)).json(response);
	};

	register = async (req: Request<IRegisterRequest>, res: Response) => {
		const response = await this.authService.register(req.body);
		res.status(response.success ? 201 : (response.error?.code ?? 500)).json(response);
	};
}

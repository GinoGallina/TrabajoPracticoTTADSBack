import { Request, Response } from "express";
import { UserService } from "../services/UserService.js";
import { IUserCreateRequest, IUserGetAllResponse, IUserGetComboRequest, IUserResponse } from "../types/IUser.js";
import { IGenericGetAllRequest } from "../types/shared/IBaseRequest.js";
import { inject, injectable } from "tsyringe";
import { BaseController } from "./BaseController.js";

@injectable()
export class UserController extends BaseController<
	UserService,
	IGenericGetAllRequest,
	IUserGetAllResponse,
	IUserResponse,
	IUserCreateRequest,
	IUserResponse,
	IUserResponse
> {
	constructor(@inject("UserService") private userService: UserService) {
		super(userService);
	}

	getCombo = async (req: Request<IUserGetComboRequest>, res: Response) => {
		const response = await this.userService.getCombo(req.body);
		res.status(response.success ? 200 : (response.error?.code ?? 500)).json(response);
	};
}

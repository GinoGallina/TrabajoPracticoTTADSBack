import { Request, Response } from "express";
import { RoleService } from "../services/RoleService.js";

export class RoleController {
	constructor(private readonly roleService: RoleService) {}

	getCombo = async (req: Request, res: Response) => {
		const response = await this.roleService.getCombo();
		res.status(response.success ? 200 : (response.error?.code ?? 500)).json(response);
	};
}

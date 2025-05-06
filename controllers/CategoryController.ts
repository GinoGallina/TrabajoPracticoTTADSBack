import { Request, Response } from "express";
import { CategoryService } from "../services/CategoryService.js";
import { ICategoryCreateRequest, ICategoryGetAllResponse, ICategoryResponse, ICategoryUpdateRequest } from "../types/ICategory.js";
import { inject, injectable } from "tsyringe";
import { BaseController } from "./BaseController.js";
import { IGenericGetAllRequest } from "../types/shared/IBaseRequest.js";
import { IGenericDeleteResponse } from "../types/shared/IBaseResponse.js";

@injectable()
export class CategoryController extends BaseController<
	CategoryService,
	IGenericGetAllRequest,
	ICategoryGetAllResponse,
	ICategoryResponse,
	ICategoryCreateRequest,
	ICategoryResponse,
	ICategoryUpdateRequest,
	ICategoryResponse,
	IGenericDeleteResponse
> {
	constructor(@inject("CategoryService") private categoryService: CategoryService) {
		super(categoryService);
	}

	getCombo = async (_: Request, res: Response) => {
		const response = await this.categoryService.getCombo();
		res.status(response.success ? 200 : (response.error?.code ?? 500)).json(response);
	};
}

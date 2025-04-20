import { Request, Response } from "express";
import { ProductService } from "../services/ProductService.js";
import { IProductCreateRequest, IProductGetAllResponse, IProductGetOneResponse, IProductResponse } from "../types/IProduct.js";
import { IGenericGetAllRequest } from "../types/shared/IBaseRequest.js";
import { inject, injectable } from "tsyringe";
import { BaseController } from "./BaseController.js";

@injectable()
export class ProductController extends BaseController<
	ProductService,
	IGenericGetAllRequest,
	IProductGetAllResponse,
	IProductGetOneResponse,
	IProductCreateRequest,
	IProductResponse,
	IProductResponse
> {
	constructor(@inject("ProductService") private productService: ProductService) {
		super(productService);
	}

	getAllMyProducts = async (req: Request<object, object, object, IGenericGetAllRequest>, res: Response) => {
		const response = await this.productService.getAllMyProducts(req.query);
		res.status(response.success ? 200 : (response.error?.code ?? 500)).json(response);
	};
}

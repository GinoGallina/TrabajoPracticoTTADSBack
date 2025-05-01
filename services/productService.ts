import { DataSource, QueryRunner } from "typeorm";
import { ProductRepository } from "../repository/ProductRepository.js";
import { IBaseResponse } from "../types/shared/IBaseResponse.js";
import { createErrorResponse, createSuccessResponse } from "../utils/ResponseHelpers.js";
import { Messages } from "../const/Messages.js";
import {
	IProductCreateRequest,
	IProductGetAllRequest,
	IMyProductGetAllRequest,
	IProductGetAllResponse,
	IProductResponse,
	IProductGetOneResponse,
	IProductGetDetailsResponse,
	IMyProductGetAllResponse,
} from "../types/IProduct.js";
import { validateFields } from "../utils/ServiceHelpers.js";
import { CategoryService } from "./CategoryService.js";
import { UserService } from "./UserService.js";
import { injectable, inject } from "tsyringe";
import { BaseService } from "./BaseService.js";
import { Product } from "../models/database/Product.js";
import { Review } from "../models/database/review.js";

@injectable()
export class ProductService extends BaseService<Product> {
	constructor(
		@inject("DataSource") private readonly db: DataSource,
		@inject("ProductRepository") private readonly productRepository: ProductRepository,
		@inject("CategoryService") private readonly categoryService: CategoryService,
		@inject("UserService") private readonly userService: UserService,
	) {
		super(productRepository.getRepo());
	}

	validateProduct = async (rq: IProductCreateRequest, queryRunner: QueryRunner) => {
		const validationRules = [
			{
				condition: !rq.Name,
				field: "nombre",
				errorMessage: Messages.Error.FieldRequired("nombre"),
			},
			{
				condition: !rq.Description,
				field: "descripción",
				errorMessage: Messages.Error.FieldRequired("descripción"),
			},
			{
				condition: rq.Stock < 0,
				field: "Stock",
				errorMessage: Messages.Error.FieldGreaterThanZero("Stock"),
			},
			{
				condition: rq.Price < 0,
				field: "Precio",
				errorMessage: Messages.Error.FieldGreaterThanZero("Precio"),
			},
		];

		// Iterate over validation rules and check conditions
		const hasError = await validateFields(validationRules, queryRunner, "el producto");

		if (hasError !== null) return hasError;

		// Not duplicated name
		if (await this.existsBy("Name", rq.Name)) {
			await queryRunner.rollbackTransaction();
			return createErrorResponse("Error al crear el producto", {
				code: 400,
				message: Messages.Error.UniqueField("nombre"),
			});
		}
		// Valid category
		if ((await this.categoryService.getOne(rq.CategoryId))?.data == null) {
			await queryRunner.rollbackTransaction();
			return createErrorResponse("Error al crear el producto", {
				code: 404,
				message: Messages.Error.EntityNotFound("Categoría", true),
			});
		}
		// Valid user
		if ((await this.userService.getOne(rq.UserId))?.data == null) {
			await queryRunner.rollbackTransaction();
			return createErrorResponse("Error al crear el producto", {
				code: 404,
				message: Messages.Error.EntityNotFound("Usuario", true),
			});
		}

		return null;
	};

	getRate = (reviews: Review[]) => {
		const rates = reviews.map((r) => r.Rate);
		const avgRate = rates.length ? Math.round(rates.reduce((a, b) => a + b, 0) / rates.length) : 0;

		return Math.max(0, Math.min(5, avgRate));
	};

	async getAllMyProducts(query: IMyProductGetAllRequest): Promise<IBaseResponse<IMyProductGetAllResponse | null>> {
		try {
			const products = await this.productRepository.getAllMyProducts(query);
			return {
				message: "",
				data: {
					products: products.items.map((x) => ({
						id: x.Id!.toString(),
						name: x.Name,
						description: x.Description,
						price: x.Price,
						stock: x.Stock,
						categoryName: x.Category.Name,
						createdAt: x.CreatedAt!.toISOString(),
					})),
					totalCount: products?.totalCount || 0,
				},
				error: null,
				success: true,
			};
		} catch (e) {
			console.log(e);
			return createErrorResponse("Error obteniendo productos", {
				code: e instanceof Error ? 500 : 500,
				message: "",
			});
		}
	}

	async getAll(query: IProductGetAllRequest): Promise<IBaseResponse<IProductGetAllResponse | null>> {
		try {
			const products = await this.productRepository.getAll(query);
			return {
				message: "",
				data: {
					products: products.items.map((x) => ({
						id: x.Id!.toString(),
						name: x.Name,
						price: x.Price,
						stock: x.Stock,
						categoryName: x.Category.Name,
						rating: {
							rate: this.getRate(x.Reviews),
							totalReviews: x.Reviews.length,
						},
					})),
					totalCount: products?.totalCount || 0,
				},
				error: null,
				success: true,
			};
		} catch (e) {
			console.log(e);
			return createErrorResponse("Error obteniendo productos", {
				code: e instanceof Error ? 500 : 500,
				message: "",
			});
		}
	}

	async getOne(id: string): Promise<IBaseResponse<IProductGetOneResponse | null>> {
		try {
			const product = await this.productRepository.getById(id);
			if (!product)
				return createErrorResponse("Producto no encontrado", {
					code: 404,
					message: Messages.Error.EntityNotFound("Producto"),
				});

			return createSuccessResponse("Producto obtenido correctamente", {
				id: product.Id!,
				name: product.Name,
				description: product.Description,
				price: product.Price,
				stock: product.Stock,
				image: product.Image,
				categoryId: product.Category.Id!.toString(),
				userId: product.User.Id!.toString(),
				createdAt: product.CreatedAt!.toISOString(),
			});
		} catch (e) {
			console.log(e);
			return createErrorResponse("Error obteniendo producto", {
				code: e instanceof Error ? 500 : 500,
				message: "",
			});
		}
	}

	async getDetails(id: string): Promise<IBaseResponse<IProductGetDetailsResponse | null>> {
		try {
			const product = await this.productRepository.getById(id);
			if (!product)
				return createErrorResponse("Producto no encontrado", {
					code: 404,
					message: Messages.Error.EntityNotFound("Producto"),
				});

			return createSuccessResponse("Producto obtenido correctamente", {
				name: product.Name,
				description: product.Description,
				price: product.Price,
				stock: product.Stock,
				image: product.Image,
				categoryName: product.Category.Name,
				sellerDetails: {
					userName: product.User.Username,
					storeDescription: product.User.StoreDescription || "",
					storeName: product.User.StoreName || "",
				},
			});
		} catch (e) {
			console.log(e);
			return createErrorResponse("Error obteniendo producto", {
				code: e instanceof Error ? 500 : 500,
				message: "",
			});
		}
	}

	async create(rq: IProductCreateRequest): Promise<IBaseResponse<IProductResponse | null>> {
		// Crear queryRunner
		const queryRunner = this.db.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		const manager = queryRunner.manager;

		try {
			const hasError = await this.validateProduct(rq, queryRunner);

			if (hasError !== null) return hasError;

			const product = await this.productRepository.create(rq, manager);

			console.log(product);

			await queryRunner.commitTransaction();

			return createSuccessResponse(Messages.CRUD.EntityCreated("Producto"), {
				id: product.Id!,
				name: product.Name,
				description: product.Description,
				price: product.Price,
				stock: product.Stock,
				image: product.Image,
				createdAt: product.CreatedAt!.toISOString(),
			});
		} catch (e) {
			console.log(e);
			await queryRunner.rollbackTransaction();
			return createErrorResponse("Error creando categoría", {
				code: e instanceof Error ? 500 : 500,
				message: "",
			});
		} finally {
			await queryRunner.release();
		}
	}

	async delete(id: string): Promise<IBaseResponse<IProductResponse | null>> {
		// Crear queryRunner
		const queryRunner = this.db.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		const manager = queryRunner.manager;

		try {
			// Check if exists
			const existingProduct = await this.productRepository.getById(id);

			if (existingProduct == null) {
				await queryRunner.rollbackTransaction();
				return createErrorResponse("Error al borrar el producto", {
					code: 404,
					message: Messages.Error.EntityNotFound("Producto"),
				});
			}

			const deleteProductResult = await this.productRepository.delete(id, manager);

			if (!deleteProductResult) throw new Error();

			await queryRunner.commitTransaction();

			return createSuccessResponse(Messages.CRUD.EntityDeleted("Categoría"), {
				id: existingProduct.Id!,
				name: existingProduct.Name,
				description: existingProduct.Description,
				price: existingProduct.Price,
				stock: existingProduct.Stock,
				image: existingProduct.Image,
				createdAt: existingProduct.CreatedAt!.toISOString(),
			});
		} catch (e) {
			console.log(e);
			await queryRunner.rollbackTransaction();
			return createErrorResponse("Error eliminando producto", {
				code: e instanceof Error ? 500 : 500,
				message: "",
			});
		} finally {
			await queryRunner.release();
		}
	}
}

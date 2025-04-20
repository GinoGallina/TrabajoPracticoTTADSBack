import { DataSource, EntityManager, QueryRunner } from "typeorm";
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
} from "../types/IProduct.js";
import { validateFields } from "../utils/ServiceHelpers.js";
import { CategoryService } from "./CategoryService.js";
import { UserService } from "./UserService.js";
import { injectable, inject } from "tsyringe";
import { BaseService } from "./BaseService.js";
import { Product } from "../models/database/Product.js";

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

	validateProduct = async (rq: IProductCreateRequest, queryRunner: QueryRunner, manager: EntityManager) => {
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
		if ((await this.productRepository.findByName(rq.Name, manager)) != null) {
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

	async getAllMyProducts(query: IMyProductGetAllRequest): Promise<IBaseResponse<IProductGetAllResponse | null>> {
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
						categoryId: x.Category.Id!.toString(),
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
						description: x.Description,
						price: x.Price,
						stock: x.Stock,
						categoryName: x.Category.Name,
						categoryId: x.Category.Id!.toString(),
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

	async create(rq: IProductCreateRequest): Promise<IBaseResponse<IProductResponse | null>> {
		// Crear queryRunner
		const queryRunner = this.db.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		const manager = queryRunner.manager;

		try {
			const hasError = await this.validateProduct(rq, queryRunner, manager);

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

	// 	const category = await this.productRepository.create({ name });
	// 	return {
	// 		message: "Categoría creada correctamente",
	// 		data: category,
	// 		error: null,
	// 		success: true,
	// 	};
	// }
}
// import { ProductRepository } from "../repository/productRepository.js";
// import { UserRepository } from "../repository/userRepository.js";

// const userRepository = new UserRepository();
// const productRepository = new ProductRepository();

// type ServiceResult<T> = {
//   success: boolean;
//   data?: T;
//   message?: string;
// };

// export const ProductService = {
//   create: async (params: IProduct): Promise<ServiceResult<IProduct | void>> => {
//     /* create a product
//      * @param {seller_id} - seller that owns the product
//      * @param {name} name - name of the product
//      * @param {description}
//      * @param {price}
//      * @param {stock}
//      * @param {img}
//      */
//     const result = await validateSeller(params.seller);
//     if (result instanceof Error) {
//       return {
//         success: false,
//         message: result.message,
//       };
//     }
//     try {
//       const addedProduct = await productRepository.add(params);
//       return {
//         success: true,
//         data: addedProduct,
//       };
//     } catch (error) {
//       return {
//         success: false,
//         message: "Failed to add product",
//       };
//     }
//   },
// };

// const validateSeller = async (id: string): Promise<boolean | Error> => {
//   try {
//     const user: ISeller = (await userRepository.findOne({ id })) as ISeller;
//     if (!user) {
//       return new Error("Seller not found");
//     }
//     if (user.type !== "Seller") {
//       return new Error("Seller invalid type");
//     }
//     if (user.state !== "Active") {
//       return new Error("Seller invalid status");
//     }
//     return true;
//   } catch (error) {
//     console.log(error);

//     throw new Error("An error occurred");
//   }
// };

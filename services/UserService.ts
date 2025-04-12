import { DataSource, EntityManager, In, QueryRunner, Repository } from "typeorm";
import {
	IUserCreateRequest,
	IUserGetAllResponse,
	IUserGetComboRequest,
	IUserRegisterResponse,
	IUserResponse,
	UserFindByType,
} from "../schemas/IUser.js";
import { IBaseResponse } from "../schemas/shared/IBaseResponse.js";
import { createErrorResponse, createSuccessResponse } from "../utils/ResponseHelpers.js";
import { Messages } from "../const/Messages.js";
import { UserRepository } from "../repository/UserRepository.js";
import { validateFields } from "../utils/ServiceHelpers.js";
import { Role } from "../models/database/Role.js";
import { RoleEnum } from "../schemas/IRole.js";
import bcrypt from "bcrypt";
import { IGenericGetAllRequest } from "../schemas/shared/IBaseRequest.js";
import { IGetCombo } from "../schemas/shared/IGetCombo.js";

export class UserService {
	constructor(
		private readonly db: DataSource,
		private readonly userRepository: UserRepository,
		private readonly roleRepository: Repository<Role>,
	) {}

	findByFields = async (fields: Partial<UserFindByType>, manager?: EntityManager) => {
		return await this.userRepository.findByFields(fields, manager);
	};

	validateUser = async (rq: IUserCreateRequest, queryRunner: QueryRunner, manager: EntityManager) => {
		const validationRules = [
			{
				condition: !rq.Username,
				field: "nombre de usuario",
				errorMessage: Messages.Error.FieldRequired("nombre de usuario"),
			},
			{
				condition: !rq.Email,
				field: "email",
				errorMessage: Messages.Error.FieldRequired("email"),
			},
			{
				condition: !rq.Password,
				field: "password",
				errorMessage: Messages.Error.FieldRequired("contraseña"),
			},
			{
				condition: !rq.Address,
				field: "dirección",
				errorMessage: Messages.Error.FieldRequired("dirección"),
			},
		];

		// Iterate over validation rules and check conditions
		const hasError = await validateFields(validationRules, queryRunner, "el usuario");

		if (hasError !== null) return hasError;

		// Validate Email
		const regex = /^[^\s@]+@[^\s@]+\[^\s@]+$/;
		if (!regex.test(rq.Email)) {
			await queryRunner.rollbackTransaction();
			return createErrorResponse("Error al crear el usuario", {
				code: 400,
				message: "El email ingresado no es válido.",
			});
		}

		// Validate Password
		const hasUpper = /[A-Z]/.test(rq.Password);
		const hasLower = /[a-z]/.test(rq.Password);
		const hasDigit = /\d/.test(rq.Password);
		const hasSymbol = /[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/.test(rq.Password);
		if (rq.Password.length < 8 || !(hasUpper && hasLower && hasDigit && hasSymbol)) {
			await queryRunner.rollbackTransaction();
			return createErrorResponse("Error al crear el usuario", {
				code: 400,
				message:
					"La contraseña no es válida, debe contener al menos 8 caracteres, una letra mayúscula, una letra minúscula, un número y un caracter especial.",
			});
		}

		// Check Valid roles
		const foundRoles = await this.roleRepository.findBy({
			Id: In(rq.Roles),
		});

		if (foundRoles.length !== rq.Roles.length) {
			await queryRunner.rollbackTransaction();
			return createErrorResponse("Error al crear el usuario", {
				code: 404,
				message: "Uno o más roles no existen",
			});
		}

		if (foundRoles.some((role) => role.Name === RoleEnum.Admin) && foundRoles.length > 1) {
			await queryRunner.rollbackTransaction();
			return createErrorResponse("No se puede asignar otros roles junto con ADMIN", {
				code: 400,
				message: "No puede asignar otros roles junto con Administrador",
			});
		}

		// Not duplicated email
		if ((await this.findByFields({ Email: rq.Email }, manager)) != null) {
			await queryRunner.rollbackTransaction();
			return createErrorResponse("Error al crear el usuario", {
				code: 400,
				message: "El email ingresado ya se encuentra registrado.",
			});
		}

		// Not duplicated username
		if ((await this.findByFields({ Username: rq.Username }, manager)) != null) {
			await queryRunner.rollbackTransaction();
			return createErrorResponse("Error al crear el usuario", {
				code: 400,
				message: Messages.Error.UniqueField("nombre de usuario"),
			});
		}
		return null;
	};

	async getAll(query: IGenericGetAllRequest): Promise<IBaseResponse<IUserGetAllResponse | null>> {
		try {
			const users = await this.userRepository.getAll(query);
			return {
				message: "",
				data: {
					users: users.items.map((x) => ({
						id: x.Id.toString(),
						username: x.Username,
						email: x.Email,
						address: x.Address,
						roles: x.Roles?.map((x) => x.Name),
						createdAt: x.CreatedAt.toISOString(),
					})),
					totalCount: users?.totalCount || 0,
				},
				error: null,
				success: true,
			};
		} catch (e) {
			console.log(e);
			return createErrorResponse("Error obteniendo usuarios", {
				code: e instanceof Error ? 500 : 500, // TODO: CODE DE error si es instance of Error
				message: "",
			});
		}
	}

	async getOne(id: string): Promise<IBaseResponse<IUserResponse | null>> {
		try {
			const user = await this.userRepository.getById(id);
			if (!user)
				return createErrorResponse("Usuario no encontrado", {
					code: 404,
					message: Messages.Error.EntityNotFound("Usuario"),
				});

			return createSuccessResponse("Usuario obtenido correctamente", {
				id: user.Id.toString(),
				username: user.Username,
				email: user.Email,
				address: user.Address,
				roles: user.Roles.map((x) => x.Id.toString()),
				storeName: user.StoreName,
				storeDescription: user.StoreName,
				cbu: user.Cbu,
				cuit: user.Cuit,
				createdAt: user.CreatedAt.toISOString(),
			});
		} catch (e) {
			console.log(e);
			return createErrorResponse("Error creando usuario", {
				code: e instanceof Error ? 500 : 500, // TODO: CODE DE error si es instance of Error
				message: "",
			});
		}
	}

	async getCombo(rq: IUserGetComboRequest): Promise<IBaseResponse<IGetCombo | null>> {
		try {
			const items = await this.userRepository.getCombo(rq);
			return {
				message: "",
				data: {
					items,
				},
				error: null,
				success: true,
			};
		} catch (e) {
			console.log(e);
			return createErrorResponse("Error obteniendo combo de usuarios", {
				code: e instanceof Error ? 500 : 500, // TODO: CODE DE error si es instance of Error
				message: "",
			});
		}
	}

	async create(rq: IUserCreateRequest): Promise<IBaseResponse<IUserResponse | null>> {
		// Crear queryRunner
		const queryRunner = this.db.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		const manager = queryRunner.manager;

		try {
			// Validate request
			const hasError = await this.validateUser(rq, queryRunner, manager);

			if (hasError !== null) return hasError;

			const finalRq = { ...rq, Password: await bcrypt.hash(rq.Password, 10) };

			const user = await this.userRepository.create(finalRq, manager);

			await queryRunner.commitTransaction();

			return createSuccessResponse(Messages.CRUD.EntityCreated("Usuario"), {
				id: user.Id.toString(),
				username: user.Username,
				email: user.Email,
				address: user.Address,
				roles: user.Roles.map((x) => x.Id.toString()),
				storeName: user.StoreName,
				storeDescription: user.StoreName,
				cbu: user.Cbu,
				cuit: user.Cuit,
				createdAt: user.CreatedAt.toISOString(),
			});
		} catch (e) {
			await queryRunner.rollbackTransaction();
			console.log(e);
			return createErrorResponse("Error creando usuario", {
				code: e instanceof Error ? 500 : 500, // TODO: CODE DE error si es instance of Error
				message: "",
			});
		} finally {
			await queryRunner.release();
		}
	}

	async register(
		rq: IUserCreateRequest,
		queryRunner: QueryRunner,
		manager: EntityManager,
	): Promise<IBaseResponse<IUserRegisterResponse | null>> {
		try {
			// Validate request
			const hasError = await this.validateUser(rq, queryRunner, manager);

			if (hasError !== null) return hasError;

			const user = await this.userRepository.create(rq, manager);

			return createSuccessResponse(Messages.CRUD.EntityCreated("Usuario"), {
				id: user.Id.toString(),
				username: user.Username,
				email: user.Email,
				roles: user.Roles.map((x) => x.Name),
			});
		} catch (e) {
			console.log(e);
			return createErrorResponse("Error creando usuario", {
				code: e instanceof Error ? 500 : 500,
				message: "",
			});
		}
	}

	async delete(id: string): Promise<IBaseResponse<IUserResponse | null>> {
		// Crear queryRunner
		const queryRunner = this.db.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		const manager = queryRunner.manager;

		try {
			// Check if user exists
			const existingUser = await this.userRepository.getById(id);

			if (existingUser == null) {
				await queryRunner.rollbackTransaction();
				return createErrorResponse("Error al borrar el usuario", {
					code: 404,
					message: Messages.Error.EntityNotFound("Usuario"),
				});
			}

			const deleteUserResult = await this.userRepository.delete(id, manager);

			if (!deleteUserResult) throw new Error();

			await queryRunner.commitTransaction();

			return createSuccessResponse(Messages.CRUD.EntityDeleted("Usuario", true), {
				id: existingUser.Id.toString(),
				username: existingUser.Username,
				email: existingUser.Email,
				address: existingUser.Address,
				roles: existingUser.Roles.map((x) => x.Id.toString()),
				storeName: existingUser.StoreName,
				storeDescription: existingUser.StoreName,
				cbu: existingUser.Cbu,
				cuit: existingUser.Cuit,
				createdAt: existingUser.CreatedAt.toISOString(),
			});
		} catch (e) {
			await queryRunner.rollbackTransaction();
			console.log(e);
			return createErrorResponse("Error eliminando usuario", {
				code: e instanceof Error ? 500 : 500, // TODO: CODE DE error si es instance of Error
				message: "",
			});
		} finally {
			await queryRunner.release();
		}
	}
}

// import { UserRepository } from "../repository/userRepository.js";

// const userRepository = new UserRepository();
// const productRepository = new ProductRepository();

// type ServiceResult<T> = {
// 	success: boolean;
// 	data?: T;
// 	message?: string;
// };

// export const ProductService = {
// 	create: async (
// 		params: IProduct,
// 	): Promise<ServiceResult<IProduct | void>> => {
// 		/* create a product
// 		 * @param {seller_id} - seller that owns the product
// 		 * @param {name} name - name of the product
// 		 * @param {description}
// 		 * @param {price}
// 		 * @param {stock}
// 		 * @param {img}
// 		 */
// 		const result = await validateSeller(params.seller);
// 		if (result instanceof Error) {
// 			return {
// 				success: false,
// 				message: result.message,
// 			};
// 		}
// 		try {
// 			const addedProduct = await productRepository.add(params);
// 			return {
// 				success: true,
// 				data: addedProduct,
// 			};
// 		} catch (error) {
// 			return {
// 				success: false,
// 				message: "Failed to add product",
// 			};
// 		}
// 	},
// };

// const validateSeller = async (id: string): Promise<boolean | Error> => {
// 	try {
// 		const user: ISeller = (await userRepository.findOne({ id })) as ISeller;
// 		if (!user) {
// 			return new Error("Seller not found");
// 		}
// 		if (user.type !== "Seller") {
// 			return new Error("Seller invalid type");
// 		}
// 		if (user.state !== "Active") {
// 			return new Error("Seller invalid status");
// 		}
// 		return true;
// 	} catch (error) {
// 		console.log(error);

// 		throw new Error("An error occurred");
// 	}
// };

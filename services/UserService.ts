import { DataSource, EntityManager, In, QueryRunner, Repository } from "typeorm";
import {
	IUserCreateRequest,
	IUserGetAllResponse,
	IUserGetComboRequest,
	IUserRegisterResponse,
	IUserResponse,
	IUserUpdateRequest,
} from "../types/IUser.js";
import { IBaseResponse, IGenericDeleteResponse } from "../types/shared/IBaseResponse.js";
import { createErrorResponse, createSuccessResponse } from "../utils/ResponseHelpers.js";
import { Messages } from "../const/Messages.js";
import { UserRepository } from "../repository/UserRepository.js";
import { validateFields } from "../utils/ServiceHelpers.js";
import { Role } from "../models/database/Role.js";
import { RoleEnum } from "../types/IRole.js";
import bcrypt from "bcrypt";
import { IGenericGetAllRequest } from "../types/shared/IBaseRequest.js";
import { IGetCombo } from "../types/shared/IGetCombo.js";
import { inject, injectable } from "tsyringe";
import { User } from "../models/database/User.js";
import { BaseService } from "./BaseService.js";
import { formatDateToArgentina } from "../utils/DateFormatter.js";

@injectable()
export class UserService extends BaseService<User> {
	constructor(
		@inject("DataSource") private readonly db: DataSource,
		@inject("UserRepository") private readonly userRepository: UserRepository,
		@inject("RoleTypeORMRepository") private readonly roleRepository: Repository<Role>,
	) {
		super(userRepository.getRepo());
	}

	validateUser = async (rq: IUserCreateRequest, queryRunner: QueryRunner, id?: string) => {
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
				condition: !rq.Address,
				field: "dirección",
				errorMessage: Messages.Error.FieldRequired("dirección"),
			},
		];

		// Validate Email
		const regex = /^[^\s@]+@[^\s@]+(\.[^\s@]+)?$/;
		if (!regex.test(rq.Email)) {
			await queryRunner.rollbackTransaction();
			return createErrorResponse("Error al crear el usuario", {
				code: 400,
				message: "El email ingresado no es válido.",
			});
		}

		if (!id) {
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

			validationRules.push({
				condition: !rq.Password,
				field: "password",
				errorMessage: Messages.Error.FieldRequired("contraseña"),
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

		// Check required roles for Seller
		if (foundRoles.map((x) => x.Name).includes(RoleEnum.Seller))
			validationRules.push(
				...[
					{
						condition: !rq.StoreName,
						field: "nombre de su negocio",
						errorMessage: Messages.Error.FieldRequired("nombre  de su negocio"),
					},
					{
						condition: !rq.StoreDescription,
						field: "descripción  de su negocio",
						errorMessage: Messages.Error.FieldRequired("descripción  de su negocio"),
					},
					{
						condition: !rq.Cbu,
						field: "cbu",
						errorMessage: Messages.Error.FieldRequired("cbu"),
					},
					// TODO
					// {
					// 	condition: !rq.Cuit,
					// 	field: "cuit",
					// 	errorMessage: Messages.Error.FieldRequired("cuit"),
					// },
				],
			);

		if (await this.userRepository.existsBy("Email", rq.Email, id)) {
			// Not duplicated email
			await queryRunner.rollbackTransaction();
			return createErrorResponse("Error al crear el usuario", {
				code: 400,
				message: "El email ingresado ya se encuentra registrado.",
			});
		}

		// Not duplicated username
		if (await this.userRepository.existsBy("Username", rq.Username, id)) {
			await queryRunner.rollbackTransaction();
			return createErrorResponse("Error al crear el usuario", {
				code: 400,
				message: Messages.Error.UniqueField("nombre de usuario"),
			});
		}

		// Iterate over validation rules and check conditions
		const hasError = await validateFields(validationRules, queryRunner, "el usuario");

		if (hasError !== null) return hasError;

		return null;
	};

	async getAll(query: IGenericGetAllRequest): Promise<IBaseResponse<IUserGetAllResponse | null>> {
		try {
			const users = await this.userRepository.getAll(query);
			return {
				message: "",
				data: {
					users: users.items.map((x) => ({
						id: x.Id!.toString(),
						username: x.Username,
						email: x.Email,
						address: x.Address,
						roles: x.Roles?.map((x) => x.Name),
						createdAt: formatDateToArgentina(x.CreatedAt!),
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
			const user = await this.userRepository.getById(Number(id));

			if (!user)
				return createErrorResponse("Usuario no encontrado", {
					code: 404,
					message: Messages.Error.EntityNotFound("Usuario"),
				});

			return createSuccessResponse("Usuario obtenido correctamente", {
				id: user.Id!.toString(),
				username: user.Username,
				email: user.Email,
				address: user.Address,
				roles: user.Roles.map((x) => x.Id!.toString()),
				storeName: user.StoreName,
				storeDescription: user.StoreName,
				cbu: user.Cbu,
				cuit: user.Cuit,
				createdAt: formatDateToArgentina(user.CreatedAt!),
			});
		} catch (e) {
			console.log(e);
			return createErrorResponse("Error obteniendo usuario", {
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
			const validateRq = await this.validateUser(rq, queryRunner);

			if (validateRq) return validateRq;

			const roles = await this.roleRepository.findBy({ Id: In(rq.Roles) });

			const userToCreate = new User({
				Email: rq.Email,
				Username: rq.Username,
				Address: rq.Address,
				Password: await bcrypt.hash(rq.Password, 10),
				StoreName: rq.StoreName,
				StoreDescription: rq.StoreDescription,
				Cbu: rq.Cbu,
				Cuit: rq.Cuit,
				Roles: roles,
			});

			const user = await this.userRepository.create(userToCreate, manager);

			await queryRunner.commitTransaction();

			return createSuccessResponse(Messages.CRUD.EntityCreated("Usuario"), {
				id: user.Id!.toString(),
				username: user.Username,
				email: user.Email,
				address: user.Address,
				roles: user.Roles.map((x) => x.Id!.toString()),
				storeName: user.StoreName,
				storeDescription: user.StoreName,
				cbu: user.Cbu,
				cuit: user.Cuit,
				createdAt: formatDateToArgentina(user.CreatedAt!),
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
	async update(id: string, rq: IUserUpdateRequest): Promise<IBaseResponse<IUserResponse | null>> {
		// Crear queryRunner
		const queryRunner = this.db.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		const manager = queryRunner.manager;

		try {
			// Validate request
			const validateRq = await this.validateUser(rq, queryRunner, id);

			if (validateRq) return validateRq;

			const roles = await this.roleRepository.findBy({ Id: In(rq.Roles) });

			const prevUser = await this.userRepository.getById(Number(id));

			if (!prevUser) {
				await queryRunner.rollbackTransaction();
				return createErrorResponse("Error al editar el usuario", {
					code: 404,
					message: Messages.Error.EntityNotFound("Usuario"),
				});
			}

			prevUser.Username = rq.Username;
			prevUser.Email = rq.Email;
			prevUser.Address = rq.Address;
			prevUser.Cbu = rq.Cbu;
			prevUser.StoreDescription = rq.StoreDescription;
			prevUser.StoreName = rq.StoreName;
			prevUser.Roles = roles;

			await this.userRepository.update(id, prevUser, manager);

			await queryRunner.commitTransaction();

			return createSuccessResponse(Messages.CRUD.EntityUpdated("Usuario"), {
				id: prevUser.Id!.toString(),
				username: prevUser.Username,
				email: prevUser.Email,
				address: prevUser.Address,
				roles: prevUser.Roles.map((x) => x.Id!.toString()),
				storeName: prevUser.StoreName,
				storeDescription: prevUser.StoreName,
				cbu: prevUser.Cbu,
				cuit: prevUser.Cuit,
				createdAt: formatDateToArgentina(prevUser.CreatedAt!),
			});
		} catch (e) {
			await queryRunner.rollbackTransaction();
			console.log(e);
			return createErrorResponse("Error editando usuario", {
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
			const hasError = await this.validateUser(rq, queryRunner);

			if (hasError !== null) return hasError;

			const roles = await this.roleRepository.findBy({ Id: In(rq.Roles) });

			const userToCreate = new User({
				Email: rq.Email,
				Username: rq.Username,
				Address: rq.Address,
				Password: await bcrypt.hash(rq.Password, 10),
				StoreName: rq.StoreName,
				StoreDescription: rq.StoreDescription,
				Cbu: rq.Cbu,
				Cuit: rq.Cuit,
				Roles: roles,
			});

			const user = await this.userRepository.create(userToCreate, manager);

			return createSuccessResponse(Messages.CRUD.EntityCreated("Usuario"), {
				id: user.Id!.toString(),
				username: user.Username,
				email: user.Email,
				roles: user.Roles.map((x) => x.Name),
				address: user.Address,
			});
		} catch (e) {
			console.log(e);
			return createErrorResponse("Error creando usuario", {
				code: e instanceof Error ? 500 : 500,
				message: "",
			});
		}
	}

	async delete(id: string): Promise<IBaseResponse<IGenericDeleteResponse | null>> {
		// Crear queryRunner
		const queryRunner = this.db.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		const manager = queryRunner.manager;

		try {
			// Check if user exists
			if ((await this.userRepository.existsById(id)) == null) {
				await queryRunner.rollbackTransaction();
				return createErrorResponse("Error al borrar el usuario", {
					code: 404,
					message: Messages.Error.EntityNotFound("Usuario"),
				});
			}

			const deleteUserResult = await this.userRepository.delete(id, manager);

			if (!deleteUserResult) throw new Error();

			await queryRunner.commitTransaction();

			return createSuccessResponse(Messages.CRUD.EntityDeleted("Usuario"), {
				id: id!.toString(),
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

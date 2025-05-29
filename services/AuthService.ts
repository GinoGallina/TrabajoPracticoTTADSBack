import { DataSource, In, Repository } from "typeorm";
import { IBaseResponse } from "../types/shared/IBaseResponse.js";
import { createErrorResponse, createSuccessResponse } from "../utils/ResponseHelpers.js";
import { Messages } from "../const/Messages.js";
import { ILoginRequest, ILoginResponse, IRegisterRequest, IRegisterResponse } from "../types/IAuth.js";
import { UserService } from "./UserService.js";
import { Role } from "../models/database/Role.js";
import { RoleEnum } from "../types/IRole.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { inject, injectable } from "tsyringe";
import { IUserToken } from "../types/shared/IToken.js";
import { ContextService } from "./ContextService.js";
import { UserRepository } from "../repository/UserRepository.js";

@injectable()
export class AuthService {
	constructor(
		@inject("DataSource") private readonly db: DataSource,
		@inject("UserService") private readonly userService: UserService,
		@inject("UserRepository") private readonly userRepository: UserRepository,
		@inject("RoleTypeORMRepository") private readonly roleRepository: Repository<Role>,
	) {}

	buildToken(id: number, roles: string[], address: string, email: string, username: string) {
		const expiresInSeconds = 24 * 60 * 60;
		const expirationDate = new Date(Date.now() + expiresInSeconds * 1000);

		const token = jwt.sign({ id, roles, address, email, username }, process.env.JWT_SECRET!, {
			expiresIn: expiresInSeconds,
		});

		return { token, expirationDate };
	}

	getToken(): IUserToken {
		const req = ContextService.getRequest();

		if (!req.auth) {
			throw new Error("No se ha podido encontrar el token");
		}

		const user = req.auth as IUserToken;

		return user;
	}

	async register(rq: IRegisterRequest): Promise<IBaseResponse<IRegisterResponse | null>> {
		// Crear queryRunner
		const queryRunner = this.db.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		const manager = queryRunner.manager;
		try {
			// Validate request
			const foundRoles = await this.roleRepository.findBy({
				Id: In(rq.Roles.map((x) => Number(x))),
			});

			if (foundRoles.some((role) => role.Name === RoleEnum.Admin)) {
				await queryRunner.rollbackTransaction();
				return createErrorResponse("Error al registrar el usuario", {
					code: 400,
					message: "No puede crear un usuario Administrador",
				});
			}

			// Create User
			const user = await this.userService.register(rq, queryRunner, manager);

			if (!user.success && user.error) {
				return createErrorResponse("Error al registrar el usuario", {
					code: user.error.code,
					message: user.error?.message,
				});
			}

			if (!user || !user.data) throw new Error("Error interno del servidor");

			await queryRunner.commitTransaction();

			const { token, expirationDate } = this.buildToken(
				Number(user.data.id),
				user.data.roles,
				user.data.address,
				user.data.email,
				user.data.username,
			);

			return createSuccessResponse<IRegisterResponse>(Messages.CRUD.EntityCreated("Usuario", true), {
				user: {
					id: user.data.id,
					roles: user.data.roles,
					username: user.data.username,
					email: user.data.email,
					address: user.data.address,
				},
				sessionExpiration: expirationDate.toISOString(),
				token,
			});
		} catch (e) {
			console.log(e);
			await queryRunner.rollbackTransaction();
			return createErrorResponse("Error inesperado registrando al usuario");
		}
	}

	async login(req: ILoginRequest): Promise<IBaseResponse<ILoginResponse | null>> {
		try {
			// Check if user exists
			const user = await this.userRepository.findOneBy(
				{ Email: req.email },
				{
					relations: {
						Roles: true,
					},
				},
			);

			if (user == null) {
				return createErrorResponse("Error al hacer logín", {
					code: 401,
					message: Messages.Error.EntityNotFound("Usuario"),
				});
			}

			if (!(await bcrypt.compare(req.password, user.Password))) {
				return createErrorResponse("Error al hacer logín", {
					code: 401,
					message: "Contraseña incorrecta",
				});
			}

			// JWT
			const { token, expirationDate } = this.buildToken(
				user.Id!,
				user.Roles.map((x) => x.Name),
				user.Address,
				user.Email,
				user.Username,
			);

			return createSuccessResponse<ILoginResponse>("Inicio de sesión correcto", {
				user: {
					id: user.Id!.toString(),
					roles: user.Roles.map((x) => x.Name),
					username: user.Username,
					email: user.Email,
					address: user.Address,
				},
				sessionExpiration: expirationDate.toISOString(),
				token,
			});
		} catch (e) {
			console.log(e);
			return createErrorResponse("Error inesperado al hacer login");
		}
	}
}

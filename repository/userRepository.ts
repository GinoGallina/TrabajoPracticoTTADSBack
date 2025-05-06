import { EntityManager, FindOptionsWhere, In, IsNull, Like, Repository } from "typeorm";
import { User } from "../models/database/User.js";
import { IUserGetAllRequest, IUserGetComboRequest } from "../types/IUser.js";
import { createValidOrderColumns, getAllPaginationOptions } from "../utils/RepositoryHelpers.js";
import { GetComboItem } from "../types/shared/IGetCombo.js";
import { inject, injectable } from "tsyringe";
import { BaseRepository } from "./BaseRepository.js";

@injectable()
export class UserRepository extends BaseRepository<User> {
	constructor(
		@inject("UserTypeORMRepository")
		private readonly userRepository: Repository<User>,
	) {
		super(User, userRepository);
	}

	getRepo = (manager?: EntityManager) => {
		return manager ? manager.getRepository(User) : this.userRepository;
	};

	buildUserWhere(query: IUserGetAllRequest): FindOptionsWhere<User> | FindOptionsWhere<User>[] {
		const base: FindOptionsWhere<User> = { DeletedAt: IsNull() };

		if (query.roles && query.roles.length > 0) {
			const rolesIds = Array.isArray(query.roles) ? query.roles.map(Number) : [Number(query.roles)];

			base.Roles = { Id: In(rolesIds) };
		}

		if (query.text) {
			return [
				{ ...base, Email: Like(`%${query.text}%`) },
				{ ...base, Username: Like(`%${query.text}%`) },
			];
		}

		return base;
	}

	async getAll(query: IUserGetAllRequest): Promise<{ items: User[]; totalCount: number }> {
		const validOrderColumns = createValidOrderColumns<User>(["Username", "Email", "Address", "CreatedAt"]);

		const { skip, take, order } = getAllPaginationOptions<User>(query, validOrderColumns);

		const [items, totalCount] = await this.userRepository.findAndCount({
			where: this.buildUserWhere(query),
			select: { Id: true, Email: true, Address: true, Username: true, CreatedAt: true },
			order,
			skip,
			take,
		});

		return { items, totalCount };
	}

	async getCombo(rq: IUserGetComboRequest): Promise<GetComboItem[]> {
		const users = await this.userRepository.find({
			select: { Id: true, Username: true },
			where: {
				DeletedAt: IsNull(),
				Roles: {
					Name: In(rq.roles),
				},
			},
			order: { Username: "ASC" },
		});

		return users.map((c) => ({
			id: c.Id!.toString(),
			label: c.Username,
		}));
	}
}

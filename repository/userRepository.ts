import { EntityManager, In, IsNull, Repository } from "typeorm";
import { User } from "../models/database/User.js";
import { IUserGetComboRequest } from "../types/IUser.js";
import { createValidOrderColumns, getAllPaginationOptions } from "../utils/RepositoryHelpers.js";
import { IGenericGetAllRequest } from "../types/shared/IBaseRequest.js";
import { GetComboItem } from "../types/shared/IGetCombo.js";
import { inject, injectable } from "tsyringe";

@injectable()
export class UserRepository {
	constructor(
		@inject("UserTypeORMRepository")
		private readonly repository: Repository<User>,
	) {}

	getRepo = (manager?: EntityManager) => {
		return manager ? manager.getRepository(User) : this.repository;
	};

	async getAll(query: IGenericGetAllRequest): Promise<{ items: User[]; totalCount: number }> {
		const validOrderColumns = createValidOrderColumns<User>(["Username", "Email", "Address", "CreatedAt"]);

		const { skip, take, order } = getAllPaginationOptions<User>(query, validOrderColumns);

		const [items, totalCount] = await this.repository.findAndCount({
			where: { DeletedAt: IsNull() },
			select: { Id: true, Email: true, Address: true, Username: true, CreatedAt: true },
			order,
			skip,
			take,
		});

		return { items, totalCount };
	}

	async getById(id: string): Promise<User | null> {
		const userId = Number(id);

		if (isNaN(userId)) return null;

		const user = await this.repository.findOne({
			where: { Id: userId, DeletedAt: IsNull() },
		});

		if (!user) return null;

		return user;
	}

	async getCombo(rq: IUserGetComboRequest): Promise<GetComboItem[]> {
		const users = await this.repository.find({
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

	async create(user: User, manager?: EntityManager): Promise<User> {
		const repo = this.getRepo(manager);
		return await repo.save(user);
	}

	// async update(id: string, data: Partial<User>): Promise<User | null> {
	// 	const user = await this.getById(id);
	// 	if (!category) return null;

	// 	Object.assign(category, data);
	// 	return await this.repository.save(category);
	// }

	async delete(id: string, manager?: EntityManager): Promise<boolean | null> {
		const userId = Number(id);

		if (isNaN(userId)) return null;

		const repo = this.getRepo(manager);
		const result = await repo.softDelete(id);
		return result.affected !== 0;
	}
}

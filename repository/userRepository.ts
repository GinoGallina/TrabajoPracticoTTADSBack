import { EntityManager, In, IsNull, Repository } from "typeorm";
import { User } from "../models/database/User.js";

import { IUserCreateRequest, IUserGetComboRequest, UserFindByType } from "../schemas/IUser.js";
import { createValidOrderColumns, getAllPaginationOptions } from "../utils/RepositoryHelpers.js";
import { Role } from "../models/database/Role.js";
import { IGenericGetAllRequest } from "../schemas/shared/IBaseRequest.js";
import { GetComboItem } from "../schemas/shared/IGetCombo.js";

export class UserRepository {
	constructor(
		private readonly repository: Repository<User>,
		private readonly roleRepository: Repository<Role>,
	) {}

	getRepo = (manager?: EntityManager) => {
		return manager ? manager.getRepository(User) : this.repository;
	};

	async getAll(query: IGenericGetAllRequest): Promise<{ items: User[]; totalCount: number }> {
		const validOrderColumns = createValidOrderColumns<User>(["Username", "Email", "CreatedAt"]);

		const { skip, take, order } = getAllPaginationOptions<User>(query, validOrderColumns);

		const [items, totalCount] = await this.repository.findAndCount({
			where: { DeletedAt: IsNull() },
			select: { Id: true, Email: true, Username: true, CreatedAt: true },
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
			id: c.Id.toString(),
			label: c.Username,
		}));
	}

	async findByFields(fields: Partial<UserFindByType>, manager?: EntityManager): Promise<User | null> {
		const repo = manager ? manager.getRepository(User) : this.repository;

		return await repo.findOne({ where: fields });
	}

	async create(user: IUserCreateRequest, manager?: EntityManager): Promise<User> {
		const repo = this.getRepo(manager);

		const roles = await this.roleRepository.findBy({ Id: In(user.Roles) });

		if (roles.length !== user.Roles.length) {
			throw new Error();
		}

		const userToSave = repo.create({
			...user,
			Roles: roles,
		});

		return await repo.save(userToSave);
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

// import { isValidObjectId } from "mongoose";
// import { User, IUserDocument } from "../models/database/user.js";
// import { IUserRepository } from "../shared/IUserRepository.js";
// import { UserFilter } from "../types/filters/UserFilter.js";
// import { ILoginAuth0 } from "../types/Auth0Token.js";

// export class UserRepository implements IUserRepository<IUser> {
//   public async findAll(filters: UserFilter): Promise<IUser[] | undefined> {
//     return await User.find(
//       filters,
//       "email address state type cbu shop_name cuit"
//     );
//   }

//   public async findByEmail(email: string): Promise<IUser | undefined> {
//     return (
//       (await User.findOne(
//         { email },
//         "_id email username type address state"
//       )) || undefined
//     );
//   }

//   public async findOne(item: { id: string }): Promise<IUser | undefined> {
//     if (!isValidObjectId(item.id)) return;
//     return (
//       (await User.findOne(
//         { _id: item.id },
//         "email address state type cbu shop_name cuit"
//       )) || undefined
//     );
//   }

//   public async add(user: IUser | ILoginAuth0): Promise<IUser | undefined> {
//     const newUser: IUserDocument = new User(user);
//     return await newUser.save();
//   }

//   public async update(id: string, user: IUser): Promise<IUser | undefined> {
//     return (
//       (await User.findOneAndUpdate({ _id: id }, user, { new: true })) ||
//       undefined
//     );
//   }

//   public async delete(item: { id: string }): Promise<IUser | undefined> {
//     return (
//       (await User.findOneAndUpdate(
//         { _id: item.id },
//         { state: "Disable" },
//         { new: true }
//       )) || undefined
//     );
//   }
// }

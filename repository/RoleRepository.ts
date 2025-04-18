import { EntityManager, IsNull, Repository } from "typeorm";
import { GetComboItem } from "../types/shared/IGetCombo.js";
import { Role } from "../models/database/Role.js";
import { inject, injectable } from "tsyringe";
@injectable()
export class RoleRepository {
	constructor(@inject("RoleTypeORMRepository") private readonly repository: Repository<Role>) {}

	getRepo = (manager?: EntityManager) => {
		return manager ? manager.getRepository(Role) : this.repository;
	};

	async getById(id: string): Promise<Role | null> {
		const roleId = Number(id);

		if (isNaN(roleId)) return null;

		const user = await this.repository.findOne({
			where: { Id: roleId, DeletedAt: IsNull() },
		});

		if (!user) return null;

		return user;
	}
	async getCombo(): Promise<GetComboItem[]> {
		const roles = await this.repository.find({
			select: { Id: true, Name: true },
			where: { DeletedAt: IsNull() },
			order: { Name: "ASC" },
		});

		return roles.map((r) => ({
			id: r.Id!.toString(),
			label: r.Name,
		}));
	}
}

import { FindOptionsWhere, IsNull, Repository } from "typeorm";
import { Order } from "../models/database/Order.js";
import { createValidOrderColumns, getAllPaginationOptions } from "../utils/RepositoryHelpers.js";
import { IGenericGetAllRequest } from "../types/shared/IBaseRequest.js";
import { inject, injectable } from "tsyringe";
import { AuthService } from "../services/AuthService.js";
import { RoleEnum } from "../types/IRole.js";
import { BaseRepository } from "./BaseRepository.js";

@injectable()
export class OrderRepository extends BaseRepository<Order> {
	constructor(
		@inject("OrderTypeORMRepository")
		private readonly orderRepository: Repository<Order>,
		@inject("AuthService")
		private readonly authService: AuthService,
	) {
		super(Order, orderRepository);
	}

	async getAll(query: IGenericGetAllRequest): Promise<{ items: Order[]; totalCount: number }> {
		const validOrderColumns = createValidOrderColumns<Order>(["TotalPrice", "CreatedAt"]);

		const { skip, take, order } = getAllPaginationOptions<Order>(query, validOrderColumns);

		const token = this.authService.getToken();

		const whereCondition: FindOptionsWhere<Order> = {
			DeletedAt: IsNull(),
		};

		if (!token.roles.includes(RoleEnum.Admin)) {
			whereCondition.UserId = Number(token.id);
		}

		const [items, totalCount] = await this.orderRepository.findAndCount({
			where: whereCondition,
			relations: ["PaymentType", "User", "OrderItems"],
			select: { Id: true, Status: true, ShippingAddress: true, TotalPrice: true, CreatedAt: true },
			order,
			skip,
			take,
		});

		return { items, totalCount };
	}
}

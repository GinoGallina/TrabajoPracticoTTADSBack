import { EntityManager, FindOptionsWhere, IsNull, Repository } from "typeorm";
import { Order } from "../models/database/Order.js";
import { createValidOrderColumns, getAllPaginationOptions } from "../utils/RepositoryHelpers.js";
import { IGenericGetAllRequest } from "../types/shared/IBaseRequest.js";
import { inject, injectable } from "tsyringe";
import { AuthService } from "../services/AuthService.js";
import { RoleEnum } from "../types/IRole.js";

@injectable()
export class OrderRepository {
	constructor(
		@inject("OrderTypeORMRepository")
		private readonly repository: Repository<Order>,
		@inject("AuthService")
		private readonly authService: AuthService,
	) {}

	getRepo = (manager?: EntityManager) => {
		return manager ? manager.getRepository(Order) : this.repository;
	};

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
		const [items, totalCount] = await this.repository.findAndCount({
			where: whereCondition,
			relations: ["PaymentType", "User", "OrderItems"],
			select: { Id: true, Status: true, ShippingAddress: true, TotalPrice: true, CreatedAt: true },
			order,
			skip,
			take,
		});

		return { items, totalCount };
	}

	async getById(id: string): Promise<Order | null> {
		const orderId = Number(id);

		if (isNaN(orderId)) return null;

		const order = await this.repository.findOne({
			where: { Id: orderId, DeletedAt: IsNull() },
			relations: ["PaymentType", "User", "OrderItems", "OrderItems.Product"],
			select: { Id: true, Status: true, ShippingAddress: true, TotalPrice: true, CreatedAt: true },
		});

		if (!order) return null;

		return order;
	}

	async create(order: Order, manager?: EntityManager): Promise<Order> {
		const repo = this.getRepo(manager);
		return await repo.save(order);
	}

	// async update(id: string, data: Partial<Order>): Promise<Order | null> {
	// 	const order = await this.getById(id);
	// 	if (!order) return null;

	// 	Object.assign(order, data);
	// 	return await this.repository.save(order);
	// }

	async delete(id: string, manager?: EntityManager): Promise<boolean | null> {
		const orderId = Number(id);

		if (isNaN(orderId)) return null;

		const repo = this.getRepo(manager);
		const result = await repo.softDelete(id);
		return result.affected !== 0;
	}
}

// import { Order, IOrderDocument } from "../models/database/order.js";
// import { IOrderRepository } from "../shared/IOrderRepository.js";
// import { ClientSession, now } from "mongoose";
// import IOrder from "../types/IOrder.js";

// export class OrderRepository implements IOrderRepository<IOrder> {
//   public async add(order: IOrder): Promise<IOrder | undefined> {
//     const newORder: IOrderDocument = new Order(order);
//     return await newORder.save();
//   }

//   public async update(id: string, order: IOrder): Promise<IOrder | undefined> {
//     return (
//       (await Order.findOneAndUpdate(
//         {
//           _id: id,
//         },
//         order,
//         { new: true }
//       )) || undefined
//     );
//   }

//   public async delete(item: { id: string }): Promise<IOrder | undefined> {
//     return (await Order.findOneAndDelete({ _id: item.id })) || undefined;
//   }

//   public async updateAll(
//     cartId: string,
//     state: string,
//     session: ClientSession
//   ): Promise<boolean | undefined> {
//     const resp = await Order.updateMany(
//       { cartId: cartId },
//       { state: state, completedAt: now().getDate() },
//       { new: true, session: session }
//     );
//     return resp.acknowledged || undefined;
//   }
// }

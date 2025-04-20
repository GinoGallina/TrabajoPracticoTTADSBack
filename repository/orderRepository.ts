import { EntityManager, IsNull, Repository } from "typeorm";
import { Order } from "../models/database/Order.js";
import { createValidOrderColumns, getAllPaginationOptions } from "../utils/RepositoryHelpers.js";
import { IGenericGetAllRequest } from "../types/shared/IBaseRequest.js";
import { inject, injectable } from "tsyringe";

@injectable()
export class OrderRepository {
	constructor(
		@inject("OrderTypeORMRepository")
		private readonly repository: Repository<Order>,
	) {}

	getRepo = (manager?: EntityManager) => {
		return manager ? manager.getRepository(Order) : this.repository;
	};

	async getAll(query: IGenericGetAllRequest): Promise<{ items: Order[]; totalCount: number }> {
		const validOrderColumns = createValidOrderColumns<Order>(["TotalPrice", "CreatedAt"]);

		const { skip, take, order } = getAllPaginationOptions<Order>(query, validOrderColumns);

		const [items, totalCount] = await this.repository.findAndCount({
			where: { DeletedAt: IsNull() },
			relations: ["PaymentType", "User", "OrderItems"],
			select: { Id: true, Status: true, TotalPrice: true, CreatedAt: true },
			order,
			skip,
			take,
		});

		return { items, totalCount };
	}

	async getById(id: string): Promise<Order | null> {
		const categoryId = Number(id);

		if (isNaN(categoryId)) return null;

		const category = await this.repository.findOne({
			where: { Id: categoryId, DeletedAt: IsNull() },
		});

		if (!category) return null;

		return category;
	}

	async create(order: Order, manager?: EntityManager): Promise<Order> {
		const repo = this.getRepo(manager);
		return await repo.save(order);
	}

	// async update(id: string, data: Partial<Order>): Promise<Order | null> {
	// 	const category = await this.getById(id);
	// 	if (!category) return null;

	// 	Object.assign(category, data);
	// 	return await this.repository.save(category);
	// }

	async delete(id: string, manager?: EntityManager): Promise<boolean | null> {
		const categoryId = Number(id);

		if (isNaN(categoryId)) return null;

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

import { PaymentType } from "../models/database/PaymentType.js";
import { EntityManager, IsNull, Repository } from "typeorm";

import { IPaymentTypeCreateRequest } from "../types/IPaymentType.js";
import { GetComboItem } from "../types/shared/IGetCombo.js";
import { createValidOrderColumns, getAllPaginationOptions } from "../utils/RepositoryHelpers.js";
import { IGenericGetAllRequest } from "../types/shared/IBaseRequest.js";
import { inject, injectable } from "tsyringe";

@injectable()
export class PaymentTypeRepository {
	constructor(
		@inject("PaymentTypeTypeORMRepository")
		private readonly repository: Repository<PaymentType>,
	) {}

	getRepo = (manager?: EntityManager) => {
		return manager ? manager.getRepository(PaymentType) : this.repository;
	};

	async getAll(query: IGenericGetAllRequest): Promise<{ items: PaymentType[]; totalCount: number }> {
		const validOrderColumns = createValidOrderColumns<PaymentType>(["Name", "CreatedAt"]);

		const { skip, take, order } = getAllPaginationOptions<PaymentType>(query, validOrderColumns);

		const [items, totalCount] = await this.repository.findAndCount({
			where: { DeletedAt: IsNull() },
			select: { Id: true, Name: true, CreatedAt: true },
			order,
			skip,
			take,
		});

		return { items, totalCount };
	}

	async getById(id: string): Promise<PaymentType | null> {
		const paymentTypeId = Number(id);

		if (isNaN(paymentTypeId)) return null;

		const paymentType = await this.repository.findOne({
			where: { Id: paymentTypeId, DeletedAt: IsNull() },
		});

		if (!paymentType) return null;

		return paymentType;
	}

	async getCombo(): Promise<GetComboItem[]> {
		const categories = await this.repository.find({
			select: { Id: true, Name: true },
			where: { DeletedAt: IsNull() },
			order: { Name: "ASC" },
		});

		return categories.map((c) => ({
			id: c.Id!.toString(),
			label: c.Name,
		}));
	}

	async findByName(name: string, manager?: EntityManager): Promise<PaymentType | null> {
		const repo = this.getRepo(manager);
		const paymentType = await repo.findOne({
			where: { Name: name, DeletedAt: IsNull() },
		});
		if (!paymentType) return null;
		return paymentType;
	}

	async create(paymentType: IPaymentTypeCreateRequest, manager?: EntityManager): Promise<PaymentType> {
		const repo = this.getRepo(manager);
		return await repo.save(paymentType);
	}

	// async update(id: string, data: Partial<PaymentType>): Promise<PaymentType | null> {
	// 	const paymentType = await this.getById(id);
	// 	if (!paymentType) return null;

	// 	Object.assign(paymentType, data);
	// 	return await this.repository.save(paymentType);
	// }

	async delete(id: string, manager?: EntityManager): Promise<boolean | null> {
		const paymentTypeId = Number(id);

		if (isNaN(paymentTypeId)) return null;

		const repo = this.getRepo(manager);
		const result = await repo.softDelete(id);
		return result.affected !== 0;
	}
}

// import { Repository } from "../shared/repository.js";
// import {
//   PaymentType,
//   IPaymentTypeDocuemnt,
// } from "../models/database/payment_type.js";
// import IPaymentType from "../types/IPaymentType.js";

// export class PaymentTypeRepository implements Repository<IPaymentType> {
//   public async findAll(): Promise<IPaymentType[] | undefined> {
//     return await PaymentType.find({ state: "Active" });
//   }

//   public async findOne(item: {
//     id: string;
//   }): Promise<IPaymentType | undefined> {
//     const _id = new Object(item.id);
//     return (await PaymentType.findOne({ _id })) || undefined;
//   }

//   public async add(
//     paymentType: IPaymentType,
//   ): Promise<IPaymentType | undefined> {
//     const newPaymentType: IPaymentTypeDocuemnt = new PaymentType(paymentType);
//     return await newPaymentType.save();
//   }

//   public async update(
//     id: string,
//     paymentType: IPaymentType,
//   ): Promise<IPaymentType | undefined> {
//     return (
//       (await PaymentType.findOneAndUpdate(
//         {
//           _id: id,
//           state: "Active",
//         },
//         paymentType,
//         { new: true },
//       )) || undefined
//     );
//   }

//   public async delete(item: { id: string }): Promise<IPaymentType | undefined> {
//     return (
//       (await PaymentType.findByIdAndUpdate(
//         { _id: item.id },
//         { state: "Archived" },
//         { new: true },
//       )) || undefined
//     );
//   }
// }

import { PaymentType } from "../models/database/PaymentType.js";
import { FindOptionsWhere, IsNull, Like, Repository } from "typeorm";
import { GetComboItem } from "../types/shared/IGetCombo.js";
import { createValidOrderColumns, getAllPaginationOptions } from "../utils/RepositoryHelpers.js";
import { IGenericGetAllRequest } from "../types/shared/IBaseRequest.js";
import { inject, injectable } from "tsyringe";
import { BaseRepository } from "./BaseRepository.js";

@injectable()
export class PaymentTypeRepository extends BaseRepository<PaymentType> {
	constructor(
		@inject("PaymentTypeTypeORMRepository")
		private readonly paymentTypeRepository: Repository<PaymentType>,
	) {
		super(PaymentType, paymentTypeRepository);
	}

	buildWhere(query: IGenericGetAllRequest): FindOptionsWhere<PaymentType> | FindOptionsWhere<PaymentType>[] {
		const base: FindOptionsWhere<PaymentType> = { DeletedAt: IsNull() };

		if (query.text) {
			return [{ ...base, Name: Like(`%${query.text}%`) }];
		}

		return base;
	}

	async getAll(query: IGenericGetAllRequest): Promise<{ items: PaymentType[]; totalCount: number }> {
		const validOrderColumns = createValidOrderColumns<PaymentType>(["Name", "CreatedAt"]);

		const { skip, take, order } = getAllPaginationOptions<PaymentType>(query, validOrderColumns);

		const [items, totalCount] = await this.paymentTypeRepository.findAndCount({
			where: this.buildWhere(query),
			select: { Id: true, Name: true, CreatedAt: true },
			order,
			skip,
			take,
		});

		return { items, totalCount };
	}

	async getCombo(): Promise<GetComboItem[]> {
		const categories = await this.paymentTypeRepository.find({
			select: { Id: true, Name: true },
			where: { DeletedAt: IsNull() },
			order: { Name: "ASC" },
		});

		return categories.map((c) => ({
			id: c.Id!.toString(),
			label: c.Name,
		}));
	}
}

import { Request, Response } from "express";
import { PaymentTypeService } from "../services/PaymentTypeService.js";
import {
	IPaymentTypeCreateRequest,
	IPaymentTypeGetAllResponse,
	IPaymentTypeResponse,
	IPaymentTypeUpdateRequest,
} from "../types/IPaymentType.js";
import { IGenericGetAllRequest } from "../types/shared/IBaseRequest.js";
import { inject, injectable } from "tsyringe";
import { BaseController } from "./BaseController.js";
import { IGenericDeleteResponse } from "../types/shared/IBaseResponse.js";

@injectable()
export class PaymentTypeController extends BaseController<
	PaymentTypeService,
	IGenericGetAllRequest,
	IPaymentTypeGetAllResponse,
	IPaymentTypeResponse,
	IPaymentTypeCreateRequest,
	IPaymentTypeResponse,
	IPaymentTypeUpdateRequest,
	IPaymentTypeResponse,
	IGenericDeleteResponse
> {
	constructor(@inject("PaymentTypeService") private paymentTypeService: PaymentTypeService) {
		super(paymentTypeService);
	}

	getCombo = async (req: Request, res: Response) => {
		const response = await this.paymentTypeService.getCombo();
		res.status(response.success ? 200 : (response.error?.code ?? 500)).json(response);
	};
}

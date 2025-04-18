import { Request, Response } from "express";
import { PaymentTypeService } from "../services/PaymentTypeService.js";
import { IPaymentTypeCreateRequest, IPaymentTypeDeleteRequest, IPaymentTypeGetOneRequest } from "../types/IPaymentType.js";
import { IGenericGetAllRequest } from "../types/shared/IBaseRequest.js";
import { inject, injectable } from "tsyringe";

@injectable()
export class PaymentTypeController {
	constructor(@inject("PaymentTypeService") private readonly paymentTypeService: PaymentTypeService) {}

	getAll = async (req: Request<object, object, object, IGenericGetAllRequest>, res: Response) => {
		const response = await this.paymentTypeService.getAll(req.query);
		res.status(response.success ? 200 : (response.error?.code ?? 500)).json(response);
	};

	getOne = async (req: Request<object, object, object, IPaymentTypeGetOneRequest>, res: Response) => {
		const response = await this.paymentTypeService.getOne(req.query.id);
		res.status(response.success ? 200 : (response.error?.code ?? 500)).json(response);
	};

	getCombo = async (req: Request, res: Response) => {
		const response = await this.paymentTypeService.getCombo();
		res.status(response.success ? 200 : (response.error?.code ?? 500)).json(response);
	};

	create = async (req: Request<IPaymentTypeCreateRequest>, res: Response) => {
		const response = await this.paymentTypeService.create(req.body);
		res.status(response.success ? 201 : (response.error?.code ?? 500)).json(response);
	};

	delete = async (req: Request<IPaymentTypeDeleteRequest>, res: Response) => {
		const response = await this.paymentTypeService.delete(req.body.Id);
		res.status(response.success ? 201 : (response.error?.code ?? 500)).json(response);
	};
}

// import { PaymentType } from "../models/database/payment_type.js";
// import { validatePaymentType } from "../schemas/payment_type.js";
// import { Request, Response } from "express";
// import { PaymentTypeRepository } from "./../repository/payment_typeRepository.js";

// const paymentTypeRepository = new PaymentTypeRepository();

// const paymenttypeController = {
//   getAllPaymentTypes: async (req: Request, res: Response) => {
//     try {
//       const paymentTypes = await paymentTypeRepository.findAll();
//       res.status(200).json(paymentTypes);
//     } catch (error) {
//       res.status(500).json({ error: "Error getting Payment Types" });
//     }
//   },
//   getPaymentTypeById: async (req: Request, res: Response) => {
//     try {
//       const id = req.params.id;
//       const paymentType = await paymentTypeRepository.findOne({ id });
//       if (!paymentType) {
//         res.status(404).json({ error: "Payment Type not found" });
//       }
//       res.status(200).json(paymentType);
//     } catch (error) {
//       res.status(500).json({ error: "Payment Type not found" });
//     }
//   },

//   createPaymentType: async (req: Request, res: Response) => {
//     try {
//       const result = validatePaymentType(req.body);
//       if (!result.success) {
//         // 400 Bad Request
//         console.log(result.error.message);
//         return res
//           .status(400)
//           .json({ error: JSON.parse(result.error.message) });
//       }

//       //VER SI LO DEJO O DIRECTO CON req.body
//       const newPaymentType = new PaymentType(req.body);

//       const savedPaymentType = await paymentTypeRepository.add(newPaymentType);
//       //const savedPaymentType = await newPaymentType.save()
//       res
//         .status(201)
//         .json({ message: "Payment Type created", data: savedPaymentType });
//     } catch (error) {
//       res.status(500).json({ error: "Payment Type creation error" });
//     }
//   },

//   updatePaymentTypeById: async (req: Request, res: Response) => {
//     try {
//       const updatedPaymentType = await paymentTypeRepository.update(
//         req.params.id,
//         req.body,
//       );
//       if (!updatedPaymentType) {
//         return res.status(404).json({ error: "Payment Type not found" });
//       }
//       res.status(200).json(updatedPaymentType);
//     } catch (error) {
//       res.status(500).json({ error: "Error updating Payment Type" });
//     }
//   },

//   deletePaymentTypeById: async (req: Request, res: Response) => {
//     try {
//       const id = req.params.id;
//       const paymentTypeDeleted = await paymentTypeRepository.delete({ id });
//       if (!paymentTypeDeleted) {
//         return res.status(404).json({ error: "Payment Type not found" });
//       }
//       res.status(204).send();
//     } catch (error) {
//       res.status(500).json({ error: "Error deleting Payment Type" });
//     }
//   },
// };

// export default paymenttypeController;

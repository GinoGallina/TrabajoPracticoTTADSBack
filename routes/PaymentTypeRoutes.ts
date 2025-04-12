import { Router } from "express";
import { PaymentTypeController } from "../controllers/PaymentTypeController.js";
import { PaymentTypeRepository } from "../repository/PaymentTypeRepository.js";
import { PaymentType } from "../models/database/PaymentType.js";
import { PaymentTypeService } from "../services/PaymentTypeService.js";
import { DataSource } from "typeorm";

export const PaymentTypeRouter = (db: DataSource) => {
	const router = Router();

	const paymentTypeRepository = new PaymentTypeRepository(db.getRepository(PaymentType));

	const paymentTypeService = new PaymentTypeService(paymentTypeRepository, db);
	const paymentTypeController = new PaymentTypeController(paymentTypeService);

	router.get("/getAll", paymentTypeController.getAll.bind(paymentTypeController));
	router.get("/getOne", paymentTypeController.getOne.bind(paymentTypeController));
	router.get("/getCombo", paymentTypeController.getCombo.bind(paymentTypeController));
	router.post("/create", paymentTypeController.create.bind(paymentTypeController));
	router.post("/delete", paymentTypeController.delete.bind(paymentTypeController));

	return router;
};

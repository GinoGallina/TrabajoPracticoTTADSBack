import { Router } from "express";
import { container } from "tsyringe";
import { PaymentTypeController } from "../controllers/PaymentTypeController.js";

export const PaymentTypeRouter = () => {
	const router = Router();

	const paymentTypeController = container.resolve(PaymentTypeController);

	router.get("/getAll", paymentTypeController.getAll.bind(paymentTypeController));
	router.get("/getOne", paymentTypeController.getOne.bind(paymentTypeController));
	router.get("/getCombo", paymentTypeController.getCombo.bind(paymentTypeController));
	router.post("/create", paymentTypeController.create.bind(paymentTypeController));
	router.post("/delete", paymentTypeController.delete.bind(paymentTypeController));

	return router;
};

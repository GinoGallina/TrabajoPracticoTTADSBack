import { Router } from "express";
import { container } from "tsyringe";
import { OrderController } from "../controllers/OrderController.js";

export const OrderRouter = () => {
	const router = Router();

	const orderController = container.resolve(OrderController);

	// router.get("/getAll", orderController.getAll.bind(orderController));
	// router.get("/getOne", orderController.getOne.bind(orderController));
	router.post("/create", orderController.create.bind(orderController));
	// router.post("/delete", orderController.delete.bind(orderController));

	return router;
};

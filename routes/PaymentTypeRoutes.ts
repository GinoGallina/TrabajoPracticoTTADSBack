import { Router } from "express";
import { container } from "tsyringe";
import { PaymentTypeController } from "../controllers/PaymentTypeController.js";
import { authorizeRoles } from "../middleware/Roles/AuthorizeRoles.js";
import { RoleEnum } from "../types/IRole.js";

export const PaymentTypeRouter = () => {
	const router = Router();

	const paymentTypeController = container.resolve(PaymentTypeController);

	router.get("/getAll", authorizeRoles(RoleEnum.Admin), paymentTypeController.getAll.bind(paymentTypeController));
	router.get("/getOne/:id", authorizeRoles(RoleEnum.Admin), paymentTypeController.getOne.bind(paymentTypeController));
	router.get(
		"/getCombo",
		authorizeRoles(RoleEnum.Admin, RoleEnum.User, RoleEnum.Seller),
		paymentTypeController.getCombo.bind(paymentTypeController),
	);
	router.post("/create", authorizeRoles(RoleEnum.Admin), paymentTypeController.create.bind(paymentTypeController));
	router.post("/update/:id", authorizeRoles(RoleEnum.Admin), paymentTypeController.update.bind(paymentTypeController));
	router.post("/delete/:id", authorizeRoles(RoleEnum.Admin), paymentTypeController.delete.bind(paymentTypeController));

	return router;
};

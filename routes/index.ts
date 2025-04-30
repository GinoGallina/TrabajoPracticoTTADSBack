import { Router } from "express";
import { CategoryRouter } from "./CategoryRoutes.js";
import { ProductRouter } from "./ProductRoutes.js";
import { UserRouter } from "./UserRoutes.js";
import { AuthRouter } from "./AuthRoutes.js";
import { RoleRouter } from "./RoleRoutes.js";
import { PaymentTypeRouter } from "./PaymentTypeRoutes.js";
import { OrderRouter } from "./OrderRoutes.js";
import { ReviewRouter } from "./ReviewRoutes.js";

export default () => {
	const router = Router();

	router.use("/category", CategoryRouter());
	router.use("/product", ProductRouter());
	router.use("/user", UserRouter());
	router.use("/auth", AuthRouter());
	router.use("/role", RoleRouter());
	router.use("/paymentType", PaymentTypeRouter());
	router.use("/order", OrderRouter());
	router.use("/review", ReviewRouter());

	return router;
};

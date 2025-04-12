import { Router } from "express";
import { CategoryRouter } from "./CategoryRoutes.js";
import { DataSource } from "typeorm";
import { ProductRouter } from "./ProductRoutes.js";
import { UserRouter } from "./UserRoutes.js";
import { AuthRouter } from "./AuthRoutes.js";
import { RoleRouter } from "./RoleRoutes.js";
import { PaymentTypeRouter } from "./PaymentTypeRoutes.js";

// // import { userRouter } from "./userRouter";
// // import { authRouter } from "./authRouter";

// // Asigna las demás rutas
// // router.use("/user", userRouter);
// // router.use("/auth", authRouter);

export default (db: DataSource) => {
	const router = Router();

	router.use("/category", CategoryRouter(db));
	router.use("/product", ProductRouter(db));
	router.use("/user", UserRouter(db));
	router.use("/auth", AuthRouter(db));
	router.use("/role", RoleRouter(db));
	router.use("/paymentType", PaymentTypeRouter(db));

	return router;
};

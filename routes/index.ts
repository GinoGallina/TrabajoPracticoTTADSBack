import { Router } from "express";
import { CategoryRouter } from "./CategoryRoutes.js";
import { DataSource } from "typeorm";

// // import { productRouter } from "./productRouter";
// // import { userRouter } from "./userRouter";
// // import { authRouter } from "./authRouter";

// // Asigna las demás rutas
// // router.use("/products", productRouter);
// // router.use("/user", userRouter);
// // router.use("/auth", authRouter);

export default (db: DataSource) => {
	const router = Router();

	router.use("/category", CategoryRouter(db, router));

	return router;
};

import { Router } from "express";

import PaymentTypeController from "../controllers/payment_type.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";

export const paymentTypeRouter = Router();

paymentTypeRouter.get("/", PaymentTypeController.getAllPaymentTypes);
paymentTypeRouter.post("/",adminMiddleware, PaymentTypeController.createPaymentType);
paymentTypeRouter.get("/:id", PaymentTypeController.getPaymentTypeById);
paymentTypeRouter.delete("/:id",adminMiddleware, PaymentTypeController.deletePaymentTypeById);
paymentTypeRouter.patch("/:id",adminMiddleware, PaymentTypeController.updatePaymentTypeById);

export default paymentTypeRouter;

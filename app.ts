//dotenv
import dotenv from "dotenv";
dotenv.config();

import express, { json } from "express"; // require -> commonJS
import categoryRouter from "./routes/category.js";
import payment_typeRouter from "./routes/payment_type.js";
import userRouter from "./routes/user.js";
import discountRouter from "./routes/discount.js";
import reviewRouter from "./routes/review.js";
// import { corsMiddleware } from './middlewares/cors.js'
// eslint-disable-next-line no-unused-vars
import cors from "cors";
import db from "./config/database.js";
import sellerRouter from "./routes/seller.js";
import loginRouter from "./routes/login.js";
import productRouter from "./routes/product.js";

import "./config/env.js";
import { cartRouter } from "./routes/cart.js";
import orderRouter from "./routes/order.js";

// La asigno para que Eslint no de me problemas
const conection = db;

const app = express();

app.use(json());
app.use(cors());

// app.use(corsMiddleware())
app.disable("x-powered-by");

app.use("/category", categoryRouter);
app.use("/payment_type", payment_typeRouter);
app.use("/products", productRouter);
app.use("/order", orderRouter);

app.use("/cart", cartRouter);

app.use("/user", userRouter);
app.use("/seller", sellerRouter);
app.use("/login", loginRouter);

app.use("/discount", discountRouter);
app.use("/review", reviewRouter);


const PORT = 1234;

app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`);
});

import { Router } from "express";
import ProductController from "../controllers/product.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";
import { sellerMiddleware } from "../middlewares/sellerMiddleware.js";
import { userMiddleware } from "../middlewares/userMiddleware.js";

//import ProductController from '../controllers/product.js'

export const productRouter = Router();

productRouter.get("/",(req,res,next)=>{
    if(req.query.seller){
        sellerMiddleware(req,res,next)   
    }else{
        userMiddleware(req,res,next)
    }
}, ProductController.getAllProducts);
productRouter.post("/",sellerMiddleware, ProductController.createProduct);
productRouter.get("/:id", ProductController.getProductById);
productRouter.delete("/:id",sellerMiddleware, ProductController.deleteProductById);
productRouter.put("/:id",sellerMiddleware, ProductController.updateProductById);

export default productRouter;

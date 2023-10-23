import { Request, Response } from "express";
import { ProductRepository } from "../repository/productRepository.js";
import { validateProduct } from "../schemas/product.js";

const productRepository = new ProductRepository();

const ProductController = {
  getAllProducts: async (req: Request, res: Response) => {
    try {
      const categories = await productRepository.findAll();
      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  getProductById: async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const product = await productRepository.findOne({ id });
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      res.status(200).json(product);
    } catch (error) {
      res.status(500).json(JSON.stringify(error));
    }
  },

  createProduct: async (req: Request, res: Response) => {
    try {
      const result = validateProduct(req.body);
      if (!result.success) {
        // 422 Unprocessable Entity
        return res
          .status(400)
          .json({ error: JSON.parse(result.error.message) });
      }
      //VALIDAR CON MODEL
      const savedProduct = await productRepository.add(req.body);
      res
        .status(201)
        .json({ message: "Product created", data: savedProduct });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  updateProductById: async (req: Request, res: Response) => {
    try {
      const updatedProduct = await productRepository.update(
        req.params.id,
        req.body
      );
      if (!updatedProduct) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.status(200).json(updatedProduct);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  deleteProductById: async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const productDeleted = await productRepository.delete({ id });
      if (!productDeleted) {
        return res.status(404).json({ error: "Product not found" });
      }

      res
        .status(200)
        .json({ message: "Product deleted", data: productDeleted });
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

export default ProductController;

import { Request, Response } from "express";
import { ProductService } from "../services/ProductService.js";
import { IProductCreateRequest, IProductDeleteRequest, IProductGetOneRequest } from "../types/IProduct.js";
import { IGenericGetAllRequest } from "../types/shared/IBaseRequest.js";
import { inject, injectable } from "tsyringe";

@injectable()
export class ProductController {
	constructor(@inject("ProductService") private readonly productService: ProductService) {}

	getAllMyProducts = async (req: Request<object, object, object, IGenericGetAllRequest>, res: Response) => {
		const response = await this.productService.getAllMyProducts(req.query);
		res.status(response.success ? 200 : (response.error?.code ?? 500)).json(response);
	};

	getAll = async (req: Request<object, object, object, IGenericGetAllRequest>, res: Response) => {
		const response = await this.productService.getAll(req.query);
		res.status(response.success ? 200 : (response.error?.code ?? 500)).json(response);
	};

	getOne = async (req: Request<object, object, object, IProductGetOneRequest>, res: Response) => {
		const response = await this.productService.getOne(req.query.id);
		res.status(response.success ? 200 : (response.error?.code ?? 500)).json(response);
	};

	create = async (req: Request<IProductCreateRequest>, res: Response) => {
		const response = await this.productService.create(req.body);
		res.status(response.success ? 201 : (response.error?.code ?? 500)).json(response);
	};

	delete = async (req: Request<IProductDeleteRequest>, res: Response) => {
		const response = await this.productService.delete(req.params.id);
		res.status(response.success ? 201 : (response.error?.code ?? 500)).json(response);
	};
}
// import { Request, Response } from "express";
// import { ProductRepository } from "../repository/productRepository.js";
// import { validateProduct } from "../schemas/product.js";
// import { ProductService } from "../services/productService.js";
// import { ProductFilter } from "../types/filters/ProductFilter.js";

// const productRepository = new ProductRepository();
// const ProductController = {
//   getAllProducts: async (req: Request, res: Response) => {
//     try {
//       const filter: ProductFilter = req.query as ProductFilter;
//       const products = await productRepository.findAll(filter);
//       res.status(200).json(products);
//     } catch (error) {
//       res.status(500).json(error);
//     }
//   },

//   getProductById: async (req: Request, res: Response) => {
//     try {
//       const id = req.params.id;
//       const product = await productRepository.findOne({ id });
//       if (!product) {
//         return res.status(404).json({ error: "Product not found" });
//       }

//       res.status(200).json(product);
//     } catch (error) {
//       res.status(500).json(JSON.stringify(error));
//     }
//   },

//   createProduct: async (req: Request, res: Response) => {
//     try {
//       const result = validateProduct(req.body);
//       if (!result.success) {
//         // 422 Unprocessable Entity
//         return res
//           .status(400)
//           .json({ error: JSON.parse(result.error.message) });
//       }
//       const serviceResult = await ProductService.create(req.body);
//       if (!serviceResult.success) {
//         return res.status(400).json({ error: serviceResult.message });
//       }
//       res
//         .status(201)
//         .json({ message: "Product created", data: serviceResult.data });
//     } catch (error) {
//       res.status(500).json(error);
//     }
//   },

//   updateProductById: async (req: Request, res: Response) => {
//     try {
//       const updatedProduct = await productRepository.update(
//         req.params.id,
//         req.body
//       );
//       if (!updatedProduct) {
//         return res.status(404).json({ error: "Product not found" });
//       }
//       res.status(200).json(updatedProduct);
//     } catch (error) {
//       res.status(500).json(error);
//     }
//   },
//   deleteProductById: async (req: Request, res: Response) => {
//     try {
//       const id = req.params.id;
//       const productDeleted = await productRepository.delete({ id });
//       if (!productDeleted) {
//         return res.status(404).json({ error: "Product not found" });
//       }

//       res
//         .status(200)
//         .json({ message: "Product deleted", data: productDeleted });
//     } catch (error) {
//       res.status(500).json(error);
//     }
//   },
// };

// export default ProductController;

import { Request, Response } from "express";
import { ICategoryCreateRequest, ICategoryDeleteRequest, ICategoryGetOneRequest } from "../types/ICategory.js";
import { IGenericGetAllRequest } from "../types/shared/IBaseRequest.js";
import { OrderService } from "../services/OrderService.js";
import { inject, injectable } from "tsyringe";

@injectable()
export class OrderController {
	constructor(@inject("OrderService") private readonly orderService: OrderService) {}

	// getAll = async (req: Request<object, object, object, IGenericGetAllRequest>, res: Response) => {
	// 	const response = await this.orderService.getAll(req.query);
	// 	res.status(response.success ? 200 : (response.error?.code ?? 500)).json(response);
	// };

	// getOne = async (req: Request<object, object, object, ICategoryGetOneRequest>, res: Response) => {
	// 	const response = await this.orderService.getOne(req.query.id);
	// 	res.status(response.success ? 200 : (response.error?.code ?? 500)).json(response);
	// };

	create = async (req: Request<ICategoryCreateRequest>, res: Response) => {
		const response = await this.orderService.create(req.body);
		res.status(response.success ? 201 : (response.error?.code ?? 500)).json(response);
	};

	// delete = async (req: Request<ICategoryDeleteRequest>, res: Response) => {
	// 	const response = await this.orderService.delete(req.body.Id);
	// 	res.status(response.success ? 201 : (response.error?.code ?? 500)).json(response);
	// };
}

// import { Request, Response } from "express";
// import {
//   validateCategory,
//   validatePartialCategory,
// } from "../schemas/category.js";
// import { CategoryRepository } from "./../repository/categoryRepository.js";

// const categoryRepository = new CategoryRepository();

// const categoryController = {
//   getAllCategories: async (req: Request, res: Response) => {
//     try {
//       const categories = await categoryRepository.findAll();
//       res.status(200).json(categories);
//     } catch (error) {
//       res.status(500).json(error);
//     }
//   },

//   getCategoryById: async (req: Request, res: Response) => {
//     try {
//       const id = req.params.id;
//       const category = await categoryRepository.findOne({ id });
//       if (!category) {
//         return res.status(404).json({ error: "Category not found" });
//       }

//       res.status(200).json(category);
//     } catch (error) {
//       res.status(500).json(JSON.stringify(error));
//     }
//   },

//   createCategory: async (req: Request, res: Response) => {
//     try {
//       const result = validateCategory(req.body);
//       if (!result.success) {
//         // 422 Unprocessable Entity
//         return res
//           .status(400)
//           .json({ error: JSON.parse(result.error.message) });
//       }
//       //VALIDAR CON MODEL
//       const savedCategory = await categoryRepository.add(req.body);
//       res
//         .status(201)
//         .json({ message: "Category created", data: savedCategory });
//     } catch (error) {
//       res.status(500).json(error);
//     }
//   },

//   updateCategoryById: async (req: Request, res: Response) => {
//     try {
//       const updatedCategory = await categoryRepository.update(
//         req.params.id,
//         req.body
//       );
//       if (!updatedCategory) {
//         return res.status(404).json({ error: "Category not found" });
//       }
//       res.status(200).json(updatedCategory);
//     } catch (error) {
//       res.status(500).json(error);
//     }
//   },
//   deleteCategoryById: async (req: Request, res: Response) => {
//     try {
//       const id = req.params.id;
//       const categoryDeleted = await categoryRepository.delete({ id });
//       if (!categoryDeleted) {
//         return res.status(404).json({ error: "Category not found" });
//       }

//       res
//         .status(200)
//         .json({ message: "Category deleted", data: categoryDeleted });
//     } catch (error) {
//       res.status(500).json(error);
//     }
//   },
// };

// export default categoryController;

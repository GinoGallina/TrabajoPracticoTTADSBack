// import { ProductRepository } from "../repository/productRepository.js";
// import { UserRepository } from "../repository/userRepository.js";

// const userRepository = new UserRepository();
// const productRepository = new ProductRepository();

// type ServiceResult<T> = {
//   success: boolean;
//   data?: T;
//   message?: string;
// };

// export const ProductService = {
//   create: async (params: IProduct): Promise<ServiceResult<IProduct | void>> => {
//     /* create a product
//      * @param {seller_id} - seller that owns the product
//      * @param {name} name - name of the product
//      * @param {description}
//      * @param {price}
//      * @param {stock}
//      * @param {img}
//      */
//     const result = await validateSeller(params.seller);
//     if (result instanceof Error) {
//       return {
//         success: false,
//         message: result.message,
//       };
//     }
//     try {
//       const addedProduct = await productRepository.add(params);
//       return {
//         success: true,
//         data: addedProduct,
//       };
//     } catch (error) {
//       return {
//         success: false,
//         message: "Failed to add product",
//       };
//     }
//   },
// };

// const validateSeller = async (id: string): Promise<boolean | Error> => {
//   try {
//     const user: ISeller = (await userRepository.findOne({ id })) as ISeller;
//     if (!user) {
//       return new Error("Seller not found");
//     }
//     if (user.type !== "Seller") {
//       return new Error("Seller invalid type");
//     }
//     if (user.state !== "Active") {
//       return new Error("Seller invalid status");
//     }
//     return true;
//   } catch (error) {
//     console.log(error);

//     throw new Error("An error occurred");
//   }
// };

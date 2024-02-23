import { DiscountRepository } from "../repository/discountRepository.js";
import { OrderRepository } from "../repository/orderRepository.js";
import { ProductRepository } from "../repository/productRepository.js";
import IDiscount from "../types/IDiscount.js";
import IOrder from "../types/IOrder.js";

const orderRepository = new OrderRepository();
const productRepository = new ProductRepository();
const discountRepository = new DiscountRepository();

type ServiceResult<T> = {
  success: boolean;
  data?: T;
  message?: string;
};

export const OrderService = {
  create: async (
    params: IOrder,
    session = {}
  ): Promise<ServiceResult<IOrder | void>> => {
    try {
      //Validate product
      const product = (await productRepository.findOne({
        id: params.product,
      })) as IProduct;

      const result = await validateProduct(product, params.quantity);
      if (result instanceof Error) {
        return {
          success: false,
          message: result.message,
        };
      }

      //Validate shipment
      if (params.shipment_type != "other" && !params.delivery_address) {
        return {
          success: false,
          message: "Missing shipment address",
        };
      }

      //Compute unitPrice with discount
      var unitPrice = product.price;
      const discount: IDiscount | undefined =
        await discountRepository.findCurrent({ id: product.category });
      if (discount) {
        unitPrice = product.price * (1 - discount?.value / 100);
      }

      //Build order
      const order: IOrder = {
        ...params,
        unitPrice: unitPrice,
        amount: unitPrice * params.quantity,
        completedAt: new Date(Date.now()),
      };

      //Discount stock
      product.stock -= params.quantity;
      productRepository.update(params.product, product);

      //Save order
      const addedOrder = await orderRepository.add(order, { session });

      return {
        success: true,
        data: addedOrder,
      };
    } catch (error) {
      return {
        success: false,
        message: "Failed to create order",
      };
    }
  },
};

const validateProduct = async (
  product: IProduct,
  quantity: number
): Promise<boolean | Error> => {
  try {
    if (!product) {
      return new Error("Product not found");
    }
    if (product.state !== "Active") {
      return new Error("Product invalid status");
    }
    if (product.stock < quantity) {
      return new Error("Insuficient stock");
    }

    return true;
  } catch (error) {
    console.log(error);

    throw new Error("An error occurred");
  }
};

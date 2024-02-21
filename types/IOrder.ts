import ICart from "./ICart";

interface IOrder{
  product: string;
  quantity: number;
  amount: number;
  cart?: string;
  state:"Completed" | "Cancelled";
  unitPrice: number;
  completedAt?: Date;
  //Shipment data
  shipment_type: "home_delivery" | "branch_office_pickup" | "other";
  delivery_address?: String;
  comment?: String;
  situation: "In Transit" | "Received";

}

export default IOrder;

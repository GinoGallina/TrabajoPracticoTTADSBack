interface IOrder {
  product: String;
  unitprize: Number;
  quantity: Number;
  amount: Number;
  state: "Pending" | "Completed" | "Cancelled";
  shipment: String | null;
  cart: String | null;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

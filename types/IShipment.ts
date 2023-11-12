interface IShipment {
  shipment_type: string;
  delivery_address: string | null;
  delivery_date: Date | null;
  comment: string | null;
  state: "Active" | "Archived";
  situation: "Pending" | "In Transit" | "Delivered";
  createdAt: Date;
  updatedAt: Date;
}

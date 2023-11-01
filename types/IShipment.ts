interface IShipment {
  delivery_date: Date | null;
  comment: string;
  state: "Active" | "Archived";
  situation: "Pending" | "In Transit" | "Delivered";
  createdAt: Date;
  updatedAt: Date;
}

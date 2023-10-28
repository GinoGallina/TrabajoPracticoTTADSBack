interface IProduct {
  seller: string;
  category: string;
  name: string;
  description: string;
  price: string;
  stock: number;
  img: string;
  state: "Active" | "Archived";
  createdAt: Date;
  updatedAt: Date;
}

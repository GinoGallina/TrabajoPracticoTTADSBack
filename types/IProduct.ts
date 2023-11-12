interface IProduct {
  seller: string;
  category: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  img: string;
  state: "Active" | "Archived";
  createdAt: Date;
  updatedAt: Date;
}

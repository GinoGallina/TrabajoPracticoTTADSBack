interface IReview {
  comment: string;
  rate: number;
  state: "Active" | "Archived";
  createdAt: Date;
  updatedAt: Date;
  //FALTA ORDEN
}

interface IPaymentType extends Document {
    type: string;
    state: string;
    createdAt: Date;
    updatedAt: Date;
}
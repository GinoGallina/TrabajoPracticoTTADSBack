interface IProduct {
    seller_id: string;
    name: string;
    description: string;
    price: string;
    stock: number;
    img: string;
    state: 'Active' | 'Archived';
    createdAt: Date;
    updatedAt: Date;
}

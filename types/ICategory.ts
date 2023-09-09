interface ICategory {
    category: string;
    state: 'Active' | 'Archived';
    createdAt: Date;
    updatedAt: Date;
}

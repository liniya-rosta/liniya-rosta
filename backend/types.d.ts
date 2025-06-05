export interface Product {
    _id: string;
    category: string;
    title: string;
    description: string | null;
    image: string | null;
}

export type ProductWithoutId = Omit<Product, '_id'>;

export interface Category {
    _id: string;
    title: string;
}
export interface PortfolioItemPreview {
    _id: string;
    description: string;
    cover: string;
}

export interface GalleryItem {
    _id: string;
    image: string;
}

export interface PortfolioItemDetail extends PortfolioItemPreview {
    gallery: GalleryItem[];
}

export interface Category {
    _id: string;
    title: string;
}

export interface Product {
    _id: string;
    title: string;
    category: {
        _id: string;
        title: string;
    };
    image: string
    description: string | null;
}

export interface ValidationError {
    errors: {
        [key: string]: {
            name: string;
            message: string;
        };
    };
    message: string;
    name: string;
    _message: string;
}

export interface GlobalMessage {
    error: string;
}

export interface IRequestMutation {
    name: string;
    email: string;
    phone: string;
}

export interface Contact {
    _id: string;
    location: string;
    phone1: string;
    phone2?: string;
    email: string;
    workingHours: {
        monday: string;
        tuesday: string;
        wednesday: string;
        thursday: string;
        friday: string;
        saturday: string;
        sunday: string;
    };
    linkLocation: string;
    mapLocation: string;
    instagram: string;
    whatsapp: string;
}


export interface User {
    _id: string;
    email: string;
    displayName: string;
    role: string;
}

export interface UserForm {
    email: string;
    password: string;
    confirmPassword: string;
}

export interface Post {
    _id: string;
    title: string;
    description: string;
    image: string;
}

export interface CreatePostData {
    title: string;
    description: string;
    image: File;
}

export interface UpdatePostData {
    title?: string;
    description?: string;
    image?: File;
}

export interface ProductAdmin {
    _id: string;
    title: string;
    category: string;
    image: string
    description: string | null;
}

export interface Laminate {
    _id: string;
    title: string;
    image: string;
    description: string | null;
}

export type ProductWithoutId = Omit<ProductAdmin, '_id'>;
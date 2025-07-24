export interface GalleryForm {
    image: File | null,
    alt?: {ru: string},
}

export interface PortfolioMutation {
    description: {ru: string};
    coverAlt: {ru: string};
    cover: File | null;
    gallery: GalleryForm[];
}

export interface PortfolioItemPreview {
    _id: string;
    description: {
        ru: string;
        ky: string;
    };
    cover: string;
    coverAlt: {
        ru: string;
        ky: string;
    };
    galleryCount: number;
}

export interface GalleryItem {
    _id: string;
    image: string;
    alt: {
        ru: string;
        ky: string;
    };
}

export interface PortfolioItemDetail extends PortfolioItemPreview {
    gallery: GalleryItem[];
}

type PortfolioEditValues = Partial<PortfolioMutation>;
type GalleryEditValues = Partial<GalleryForm>;

interface PaginationMeta {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export interface PaginatedPortfolioResponse extends PaginationMeta{
    items: PortfolioItemPreview[],
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
    location: {
        ru: string;
        ky?: string;
    };
    phone1: string;
    phone2?: string;
    email: string;
    workingHours: {
        monday: {
            ru: string;
            ky?: string;
        };
        tuesday: {
            ru: string;
            ky?: string;
        };
        wednesday: {
            ru: string;
            ky?: string;
        };
        thursday: {
            ru: string;
            ky?: string;
        };
        friday: {
            ru: string;
            ky?: string;
        };
        saturday: {
            ru: string;
            ky?: string;
        };
        sunday: {
            ru: string;
            ky?: string;
        };
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

export interface AdminForm extends UserForm {
    displayName?: string;
    role?: "admin" | "superadmin";
}

export interface EditProfileForm {
    displayName?: string;
    email?: string;
    password?: string;
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

export type ProductWithoutId = Omit<ProductAdmin, '_id'>;

export interface IRequest {
    _id: string;
    name: string;
    phone: string;
    email: string;
    commentOfManager?: string;
    status: "Новая" | "В работе" | "Завершена" | "Отклонена";
    createdAt: string;
    updatedAt: string;
    isArchived?: boolean;
}

export interface ServiceForm {
    title: {
        ru: string;
        ky: string;
    };
    description?: {
        ru: string;
        ky: string;
    };
}

export interface Service extends ServiceForm {
    _id: string;
}

export type ServiceUpdate = Partial<ServiceForm>;

export interface ServiceResponse {
    items: Service[];
    total: number;
}

export interface RequestMutation {
    name: string;
    phone: string;
    email: string;
    commentOfManager?: string;
    status: "Новая" | "В работе" | "Завершена" | "Отклонена";
    isArchived?: boolean;
}

export interface FetchRequestsResponse {
    data: IRequest[];
    currentPage: number;
    totalPages: number;
    totalItems: number;
}
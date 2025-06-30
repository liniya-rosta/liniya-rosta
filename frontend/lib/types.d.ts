export interface GalleryForm {
    image: File | null,
    alt?: string,
}

export interface PortfolioMutation {
    description: string;
    coverAlt: string;
    cover: File | null;
    gallery: GalleryForm[];
}

export interface PortfolioItemPreview {
    _id: string;
    description: string;
    cover: string;
    coverAlt: string;
    galleryCount: number;
}

export interface GalleryItem {
    _id: string;
    image: string;
    alt: string;
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

export interface Product {
    _id: string;
    title: string;
    category: {
        _id: string;
        title: string;
    };
    description: string | null;
    coverAlt?: string | null;
    cover: {
        url: string;
        alt: string;
    };
    images?: {
        url: string;
        alt?: string;
    }[];
    characteristics?: {
        key: string;
        value: string;
    }[];
    sale?: {
        isOnSale: boolean;
        label: string;
    };
    icon?: {
        alt: string;
        url: string;
    };
}

export interface ProductMutation {
    category: string;
    title: string;
    description?: string;
    coverAlt?: string | null;
    cover: File | null;
    images?: {
        url: File;
        alt?: string;
    }[];
    characteristics?: {
        key: string;
        value: string;
    }[];
    sale?: {
        isOnSale: boolean;
        label?: string | null;
    };
    icon?: {
        alt?: string | null;
        url?: string;
    };
}

export interface ProductUpdateMutation extends ProductMutation {
    cover?: File | null;
}
//
// export interface ProductAdmin {
//     _id: string;
//     title: string;
//     category: {
//         _id: string;
//         title: string;
//     };
//     image: string
//     description: string | null;
//     coverAlt?: string | null;
//     cover: File | null;
//     images?: {
//         url: File;
//         alt?: string;
//     }[];
//     characteristics?: {
//         key: string;
//         value: string;
//     }[];
//     sale?: {
//         isOnSale: boolean;
//         label: string;
//     };
//     icon?: {
//         alt: string;
//         url: string;
//     };
// }
//
// export type ProductWithoutId = Omit<ProductAdmin, '_id'>;

export interface IRequest {
    _id: string;
    name: string;
    phone: string;
    email: string;
    commentOfManager?: string;
    status: "Новая" | "В работе" | "Завершена" | "Отклонена";
    createdAt: string;
    updatedAt: string;
}

export interface RequestMutation {
    name: string;
    phone: string;
    email: string;
    commentOfManager?: string;
    status: "Новая" | "В работе" | "Завершена" | "Отклонена";
}

export interface FetchRequestsResponse {
    data: IRequest[];
    currentPage: number;
    totalPages: number;
    totalItems: number;
}
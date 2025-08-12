export interface ImageObject {
    alt?: {
        ru: string;
        ky?: string;
    };
    image: string;
    _id?: string;
}

interface PaginationMeta {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export interface GalleryForm {
    image: File | null,
    alt?: { ru: string },
}

export interface PortfolioMutation {
    description: { ru: string };
    coverAlt: { ru: string };
    cover?: File | null;
    gallery: GalleryForm[];
    seoTitle?: { ru: string };
    seoDescription?: { ru: string };
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
    slug: string;
    createdAt: string;
    updatedAt: string;
    seoTitle?: { ru: string, ky: string };
    seoDescription?: { ru: string, ky: string };
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

export interface PortfolioResponse extends PaginationMeta {
    items: PortfolioItemPreview[],
}

export interface Category {
    _id: string;
    title: {
        ru: string;
        ky: string;
    };
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

export interface EditAdminForm {
    email: string;
    displayName: string;
    role: "admin" | "superadmin";
}

export interface EditProfileForm {
    displayName?: string;
    email?: string;
    password?: string;
}

export interface Post {
    _id: string;
    title: {
        ru: string;
        ky: string;
    };
    description: {
        ru: string;
        ky: string;
    };
    images: ImageObject[];
    imageCount: number;
    slug: string;
    createdAt: string;
    updatedAt: string;
    seoTitle?: { ru: string, ky: string };
    seoDescription?: { ru: string, ky: string };
}

export interface PostResponse extends PaginationMeta {
    items: Post[];
}

export interface UpdateImagePost {
    imageUrl: string;
    alt?: { ru: string };
    newImage?: File;
}

export interface ProductImagesForm {
    url: File | null;
    alt?: { ru: string };
}

interface ImageItem {
    _id: string;
    url: string;
    alt: { ru: string, ky?: string; };
}

export interface Product {
    _id: string;
    title: { ru: string, ky?: string; };
    seoTitle: {
        ru: string,
        ky?: string;
    };
    seoDescription: {
        ru: string,
        ky?: string;
    };
    category: {
        _id: string;
        title: { ru: string, ky?: string; };
    };
    description: { ru: string, ky: string } | null;
    cover: {
        url: string;
        alt: { ru: string, ky?: string; };
    };
    images: ImageItem[];
    characteristics?: {
        key: { ru: string, ky?: string };
        value: { ru: string, ky?: string };
    }[];
    sale?: {
        isOnSale: boolean;
        label?: string;
    };
    icon?: {
        alt?: { ru: string, ky?: string; };
        url: string | null;
    };
    slug: string;
    createdAt: string;
    updatedAt: string;
}

export interface ProductMutation {
    category: string;
    title: { ru: string };
    seoTitle?: { ru: string };
    seoDescription?: { ru: string };
    description?: { ru: string } | null;
    coverAlt?: { ru: string } | null;
    cover?: File | null;
    images: ProductImagesForm[];
    characteristics?: {
        key: { ru: string };
        value: { ru: string };
    }[];
    sale?: {
        isOnSale: boolean;
        label?: string | null
    };
    icon?: File | null;
    iconAlt?: { ru: string } | null;
}

type ImagesEditValues = Partial<GalleryForm>;

export interface ProductUpdateMutation extends ProductMutation {
    images?: null;
    cover?: File | null;
}

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

export interface ChatMessage {
    sender: "client" | "admin";
    senderName: string;
    text: string;
    timestamp: Date;
}

export interface ChatSession {
    _id: string;
    clientName: string;
    adminId: string;
    messages: ChatMessage[];
    createdAt: Date;
    updatedAt: Date;
    status: string;
    isClientOnline: boolean;
}

export interface ChatResponse extends PaginationMeta {
    items: ChatSession[],
}

export interface ChatFilters {
    status?: string;
    clientName?: string;
    createdFrom?: string;
    createdTo?: string;
    updatedFrom?: string;
    updatedTo?: string;
    adminId?: string;
    page?: number;
    limit?: number;
}

export interface WhatsAppMessage {
    id: string;
    body: string;
    from: string;
    to: string;
    date: Date;
    type: "sent" | "received";
}
export interface Category {
    _id: string;
    title: string;
    slug?: string;
}

export interface ImageItem {
    alt: string | null;
    url: string;
}

export interface IProduct {
    _id: string;
    category: string;
    title: string;
    slug: string;
    seoTitle: string | null;
    seoDescription: string | null;
    description: string | null;
    cover: ImageItem[];
    images: ImageItem[];
    characteristics: {
        key: string;
        value: string;
    }[];
    sale: {
        isOnSale: boolean;
        label: string | null;
    };
    icon: ImageItem;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserFields {
    email: string;
    password: string;
    refreshToken: string;
    role: "admin" | "superadmin";
    __confirmPassword: string;
    displayName: string;
}

export interface UpdatesRequest {
    name?: string;
    email?: string;
    phone?: string;
    status?: 'Новая' | 'В работе' | 'Завершена' | 'Отклонена';
    commentOfManager?: string | null;
    isArchived?: string;
}

export interface ContactFields {
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
    mapLocation: string;
    linkLocation: string;
    instagram: string;
    whatsapp: string;
}

export interface GalleryUpdate {
    "gallery.$.image"?: string;
    "gallery.$.alt"?: string;
}


export interface ServiceUpdate {
    title?: string;
    description?: string;
}

export interface updatePost {
    title?: string;
    description?: string;
    images?: { alt?: string, image: string }[];
    seoTitle?: string;
    seoDescription?: string;
    slug?: string;
}
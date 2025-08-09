export interface Category {
    _id: string;
    title: string;
    slug?: string;
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

export interface WorkingHours {
    monday: {
        ru: string
        ky: string;
    };
    tuesday: {
        ru: string
        ky: string;
    };
    wednesday: {
        ru: string
        ky: string;
    };
    thursday: {
        ru: string
        ky: string;
    };
    friday: {
        ru: string
        ky: string;
    };
    saturday: {
        ru: string
        ky: string;
    };
    sunday: {
        ru: string
        ky: string;
    };
}

export interface ContactFields {
    location: {
        ru: string
        ky: string
    };
    phone1: string;
    phone2?: string;
    email: string;
    workingHours: WorkingHours;
    mapLocation: string;
    linkLocation: string;
    instagram: string;
    whatsapp: string;
}

export interface GalleryUpdate {
    "gallery.$.image"?: string;
    "gallery.$.alt.ru"?: string;
    "gallery.$.alt.ky"?: string;
}


export interface ServiceUpdate {
    title?: {
        ru: string,
        ky: string;
    };
    description?: {
        ru: string,
        ky: string;
    };
}

export interface ImageItem {
    alt?: {ru: string, ky: string;};
    image: string;
}

export interface updatePost {
    title?: {ru: string, ky: string};
    description?: {ru: string, ky: string};
    images?: { alt?: {ru: string, ky: string}, image: string }[];
    seoTitle?: {
        ru: string | null;
        ky: string | null;
    };
    seoDescription?: {
        ru: string | null;
        ky: string | null;
    };

    slug?: string;
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

export interface ClientMessage  {
    type: "client_message";
    chatId?: string;
    name: string;
    text: string;
}

export interface AdminMessage {
    type: "admin_message";
    chatId: string;
    text: string;
}

export interface  ChatMessage  {
    sender: "client" | "admin";
    senderName: string;
    text: string;
    timestamp: Date;
}

export type IncomingMessage = ClientMessage | AdminMessage;
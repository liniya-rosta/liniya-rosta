import {Types} from "mongoose";

export interface Product {
    _id: string;
    category: string;
    title: string;
    description: string | null;
    image: string | null;
}

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

export interface PortfolioUpdate {
    cover?: string;
    description?: string;
    coverAlt?: string;
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
    seoTitle?: string;
    seoDescription?: string;
    slug?: string;
}

export interface FileRequestFiles {
    [fieldname: string]: Express.Multer.File[];
}

export interface RequestWithFiles extends Express.Request {
    files?: FileRequestFiles;
}

export interface RequestWithFile extends Express.Request {
    file?: Express.Multer.File;
}

export interface GalleryItem {
    _id: Types.ObjectId;
    image: string;
    alt?: string;
}

export interface DocumentWithGallery extends Document {
    gallery: GalleryItem[];
}

export interface DocumentWithImages extends Document, IDocumentWithImages {}

export interface IDocumentWithImages {
    image?: string;
    cover?: string;
    gallery?: IGalleryItem[];
}

export interface IGalleryItem {
    _id: Types.ObjectId;
    image: string;
    alt?: string;
}

export interface IProduct extends IDocumentWithImages {
    category: Types.ObjectId;
    title: string;
    description?: string;
    image: string;
}

export interface IPost extends IDocumentWithImages {
    title: string;
    description: string;
    image: string;
}

export interface IPortfolioItem extends IDocumentWithGallery {
    cover?: string;
    coverAlt?: string;
    description?: string;
    gallery: IGalleryItem[];
}

export type ProductDocument = Document & IProduct;
export type PostDocument = Document & IPost;
export type PortfolioItemDocument = Document & IPortfolioItem;
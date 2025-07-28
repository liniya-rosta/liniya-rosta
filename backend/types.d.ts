import {Types} from "mongoose";

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
    images?: { alt?: {ru: string, ky: string}, url: string }[];
    seoTitle?: string;
    seoDescription?: string;
    slug?: string;
}

export interface FileRequestFiles {
    [fieldname: string]: Express.Multer.File[];
    body: T;
}

export interface RequestWithFiles extends Express.Request {
    files?: FileRequestFiles;
}

export interface RequestWithFile extends Express.Request {
    file?: Express.Multer.File;
}

export interface IGalleryItem {
    _id: Types.ObjectId;
    image: string;
    alt?: MultilangText;
}

export interface GalleryItem extends IGalleryItem {}

export interface DocumentWithGallery extends Document {
    gallery: GalleryItem[];
}

interface MultilangText {
    ru: string;
    ky: string;
}

interface Image {
    url: string;
    alt?: MultilangText | null;
}

export interface IDocumentWithImages {
    image?: Image;
    cover?: Image;
    gallery?: IGalleryItem[];
    images?: ImageItem[];
    icon?: Image;
}


export interface DocumentWithImages extends Document, IDocumentWithImages {}

export interface ProductImage {
    url: string;
    alt?: MultilangText | null;
}

export interface ICharacteristicItem {
    key: MultilangText;
    value: MultilangText;
}

export interface IProduct {
    category: Types.ObjectId;
    title: MultilangText;
    slug: string;
    seoTitle?: string | null;
    seoDescription?: string | null;
    description: MultilangText;
    cover: {
        url: string;
        alt?: MultilangText | null;
    };
    images: ProductImage[];
    characteristics: ICharacteristicItem[];
    sale: {
        isOnSale: boolean;
        label: MultilangText;
    };
    icon?: {
        url: string;
        alt?: MultilangText | null;
    };
}

export type ProductDocument = Document & IProduct;

export interface IPost {
    title: {
        ru: string;
        ky: string;
    };
    slug: string;
    seoTitle?: string | null;
    seoDescription?: string | null;
    description: {
        ru: string;
        ky: string;
    };
    images: {
        url: string;
        alt?: {
            ru: string;
            ky: string;
        };
    }[];
}


export type PostDocument = Document & IPost;

export interface IPortfolioItem extends DocumentWithGallery {
    cover?: Image;
    coverAlt?: MultilangText;
    description?: MultilangText;
    gallery: IGalleryItem[];
}

export type PortfolioItemDocument = Document & IPortfolioItem;
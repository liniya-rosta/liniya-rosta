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

export interface ContactDataDTO {
    _id: string;

}
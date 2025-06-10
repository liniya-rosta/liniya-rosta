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

export interface ContactDataDTO {
    _id: string;

}
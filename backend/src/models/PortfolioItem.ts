import mongoose, {Schema} from "mongoose";

const GalleryItemSchema = new Schema({
    image: {type: String, required: true},
    alt: {type: String, required: true, maxLength: 150},
});

const PortfolioItemSchema = new mongoose.Schema({
    cover: {
        type: String,
        required: [true, "Поле обложки портфолио обязательно"],
    },
    alt: {
        type: String,
        required: true,
        maxLength: 150,
    },
    gallery: {
        type: [GalleryItemSchema],
        required: true,
    },
    description: {
        type: String,
        default: null,
    },
});

export const PortfolioItem = mongoose.model("PortfolioItem", PortfolioItemSchema);
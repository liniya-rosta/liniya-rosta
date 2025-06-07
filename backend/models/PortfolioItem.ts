import mongoose, {Schema} from "mongoose";

const GalleryItemSchema = new Schema({
    image: {type: String, required: true},
});

const PortfolioItemSchema = new mongoose.Schema({
    cover: {
        type: String,
        required: [true, "Поле обложки портфолио обязательно"],
    },
    gallery: {
        type: [GalleryItemSchema],
        required: true,
    },
});

export const PortfolioItem = mongoose.model("PortfolioItem", PortfolioItemSchema);
import mongoose, {Schema} from "mongoose";

const GalleryItemSchema = new Schema({
    image: {type: String, required: true},
    alt:{
        ru: {type: String, default: null, maxLength: 150},
        ky: {type: String, default: null, maxLength: 150}
    },
});

const PortfolioItemSchema = new mongoose.Schema({
    cover: {
        type: String,
        required: [true, "Поле обложки портфолио обязательно"],
    },
    coverAlt: {
        ru: {
            type: String,
            required:[true, "Альтер-ое название обложки портфолио обязательно"],
            maxLength: 150,
        },
        ky: {
            type: String,
            required:true,
            maxLength: 150,
        }
    },
    gallery: {
        type: [GalleryItemSchema],
        required: true,
    },
    description: {
        ru: {
            type: String,
            default: null,
        },
        ky: {
            type: String,
            default: null,
        },
    },
});

export const PortfolioItem = mongoose.model("PortfolioItem", PortfolioItemSchema);
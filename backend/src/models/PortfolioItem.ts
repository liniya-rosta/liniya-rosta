import mongoose, {Schema} from "mongoose";
import slugify from "slugify";

const GalleryItemSchema = new Schema({
    image: {type: String, required: true},
    alt:{
        ru: {type: String, default: null, maxLength: 150},
        ky: {type: String, default: null, maxLength: 150}
    },
});

const PortfolioItemSchema = new mongoose.Schema({
    title: {
        ru: {
            type: String,
            required:[true, "Альтер-ое название портфолио обязательно"],
            maxLength: 120,
        },
        ky: {
            type: String,
            required:true,
            maxLength: 120,
        }
    },
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
    slug: {
        type: String,
        required: true,
        unique: true,
    },
    seoTitle: {
        ru: { type: String, default: null, maxLength: 120 },
        ky: { type: String, default: null, maxLength: 120 },
    },
    seoDescription: {
        ru: { type: String, default: null, maxLength: 300 },
        ky: { type: String, default: null, maxLength: 300 },
    }
}, {
    timestamps: true
});


PortfolioItemSchema.pre("validate", async function (next) {
    if (this.coverAlt && !this.slug) {
        let baseSlug = slugify(this.coverAlt.ru, {lower: true, strict: true});
        let uniqueSlug = baseSlug;
        let counter = 1;

        const PortfolioItem = mongoose.models.PortfolioItem || mongoose.model("PortfolioItem", PortfolioItemSchema);

        while (await PortfolioItem.exists({slug: uniqueSlug})) {
            uniqueSlug = `${baseSlug}-${counter}`;
            counter++;
        }

        this.slug = uniqueSlug;
    }

    next();
});

export const PortfolioItem = mongoose.model("PortfolioItem", PortfolioItemSchema);
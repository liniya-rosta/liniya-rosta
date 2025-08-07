import {Document, model, Schema} from "mongoose";
import slugify from "slugify";

export interface ImageItem {
    image: string;
    alt?: {
        ru: string;
        ky: string;
    };
}

export interface PostDocument extends Document {
    title: {
        ru: string;
        ky: string;
    };
    slug: string;
    seoTitle?: {
        ru: string | null;
        ky: string | null;
    };
    seoDescription?: {
        ru: string | null;
        ky: string | null;
    };
    description: {
        ru: string;
        ky: string;
    };
    images: ImageItem[];
    createdAt: Date;
    updatedAt: Date;
}

const ImageSchema = new Schema<ImageItem>({
    image: { type: String, required: true },
    alt: {
        ru: { type: String, required: true, maxLength: 150 },
        ky: { type: String, required: true, maxLength: 150 },
    },
}, { _id: false });

const PostSchema = new Schema<PostDocument>({
    title: {
        ru: {
            type: String,
            required: [true, "Поле заголовка обязательно для заполнения"]
        },
        ky: {
            type: String,
            required: true
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
    },
    description: {
        ru: {
            type: String,
            required: [true, "Поле заголовка обязательно для заполнения"]
        },
        ky: {
            type: String,
            required: true
        },
    },
    images: {
        type: [ImageSchema],
        required: true,
        validate: {
            validator: (arr: ImageItem[]) => arr.length > 0,
            message: "Необходимо загрузить хотя бы одно изображение",
        },
    },
}, {timestamps: true});

PostSchema.pre("validate", async function (next) {
    if (this.title && !this.slug) {
        let baseSlug = slugify(this.title.ru, {lower: true, strict: true});
        let uniqueSlug = baseSlug;
        let counter = 1;

        while (await Post.exists({slug: uniqueSlug})) {
            uniqueSlug = `${baseSlug}-${counter++}`;
        }

        this.slug = uniqueSlug;
    }

    next();
});

const Post = model<PostDocument>("Post", PostSchema);
export default Post;
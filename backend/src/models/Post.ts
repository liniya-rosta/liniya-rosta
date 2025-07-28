import {model, Schema} from "mongoose";
import slugify from "slugify";
import {PostDocument} from "../../types";

export interface ImageItem {
    url: string;
    alt?: {
        ru: string;
        ky: string;
    };
}

const ImageSchema = new Schema<ImageItem>({
    url: { type: String, required: true },
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
        type: String,
        default: null,
        maxLength: 120,
    },
    seoDescription: {
        type: String,
        default: null,
        maxLength: 300,
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
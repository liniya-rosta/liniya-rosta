import {Document, model, Schema} from "mongoose";
import slugify from "slugify";

export interface ImageItem {
    image: string;
    alt?: string;
}

export interface PostDocument extends Document {
    title: string;
    slug: string;
    seoTitle?: string | null;
    seoDescription?: string | null;
    description: string;
    images: ImageItem[];
    createdAt: Date;
    updatedAt: Date;
}

const ImageSchema = new Schema<ImageItem>({
    image: {type: String, required: true},
    alt: {type: String, default: null, maxLength: 150},
}, {_id: false});

const PostSchema = new Schema<PostDocument>({
    title: {
        type: String,
        required: [true, "Поле заголовка обязательно для заполнения"],
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
        type: String,
        required: [true, "Поле описания обязательно для заполнения"],
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
        let baseSlug = slugify(this.title, {lower: true, strict: true});
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
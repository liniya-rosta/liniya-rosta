import mongoose from "mongoose";
import Category from "./Category";
import slugify from "slugify";

const Schema = mongoose.Schema;

const ImageItemSchema = new Schema({
    url: {type: String, required: true},
    alt: {type: String, default: null, maxLength: 150},
});

const CharacteristicItemSchema = new Schema({
    key: {type: String, required: true},
    value: {type: String, required: true, maxLength: 150},
});

const ProductSchema = new Schema({
        category: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            required: true,
            validate: {
                validator: async (value: string) => {
                    const category = await Category.findById(value);
                    return !!category;
                },
                message: 'Категория не найдена',
            },
        },
        title: {
            type: String,
            required: [true, 'Поле заголовка обязательно для заполнения'],
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
            default: null,
        },
        cover: {
            url: {type: String, required: [true, 'Обложка продукта обязательна для заполнения']},
            alt: {type: String, default: null, maxLength: 150},
        },
        images: {
            type: [ImageItemSchema],
            required: true,
        },
        characteristics: {
            type: [CharacteristicItemSchema],
            required: true,
        },
        sale: {
            isOnSale: {type: Boolean, required: true, default: false},
            label: {type: String, default: null, maxLength: 150}
        },
        icon: {
            url: {type: String},
            alt: {type: String, default: null, maxLength: 150},
        }
    },
    {
        timestamps: true,
    });

ProductSchema.pre("validate", function (next) {
    if (this.title && !this.slug) {
        this.slug = slugify(this.title, {lower: true, strict: true});
    }
    next();
});

const Product = mongoose.model('Product', ProductSchema);
export default Product;
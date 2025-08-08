import mongoose from "mongoose";
import Category from "./Category";
import slugify from "slugify";

const Schema = mongoose.Schema;

const ImageItemSchema = new Schema({
    url: {type: String, required: true},
    alt: {
        ru: {type: String, default: null, maxLength: 150},
        ky: {type: String},
    }
});

const CharacteristicItemSchema = new Schema({
    key: {ru: {type: String}, ky: {type: String}},
    value: {ru: {type: String, maxLength: 150}, ky: {type: String}},
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
                ru:
                    {
                        type: String,
                        required: [true, 'Поле заголовка обязательно для заполнения']
                    },
                ky:
                    {
                        type: String,
                        required: true,
                    }
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
            type: new Schema({
                ru: { type: String },
                ky: { type: String },
            }),
            default: null,
        },
            cover: {
                url: {type: String, required: [true, 'Обложка продукта обязательна для заполнения']},
                alt: {
                    ru: {type: String, default: null, maxLength: 150},
                    ky: {type: String, default: null},
                }
            },
            images: {
                type: [ImageItemSchema],
            },
            characteristics: {
                type: [CharacteristicItemSchema],
            },
            sale: {
                isOnSale: {type: Boolean, required: true, default: false},
                label: {type: String, default: null, maxLength: 150}
            },
            icon: {
                url: {type: String},
                alt: {
                    ru: {type: String, default: null, maxLength: 150},
                    ky: {type: String, default: null}
                }
            }
        },
        {
            timestamps: true,
        }
    )
;

ProductSchema.pre("validate", async function (next) {
    if (this.title && !this.slug) {
        let baseSlug = slugify(this.title.ru, {lower: true, strict: true});
        let uniqueSlug = baseSlug;
        let counter = 1;

        while (await Product.exists({slug: uniqueSlug})) {
            uniqueSlug = `${baseSlug}-${counter}`;
            counter++;
        }

        this.slug = uniqueSlug;
    }

    next();
});

const Product = mongoose.model('Product', ProductSchema);
export default Product;
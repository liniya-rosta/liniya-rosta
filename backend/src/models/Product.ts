import mongoose from "mongoose";
import Category from "./Category";
import slugify from "slugify";
import {ProductDocument} from "../../types";

const Schema = mongoose.Schema;

const ImageItemSchema = new Schema({
    url: {type: String, required: true},
    alt: {
        ru: {type: String, default: null, maxLength: 150},
        ky: {type: String, required: true},
    }
});

const CharacteristicItemSchema = new Schema({
    key: {ru: {type: String, required: true}, ky: {type: String, required: true}},
    value: {ru: {type: String, required: true, maxLength: 150}, ky: {type: String, required: true}},
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
                ru:
                    {
                        type: String,
                        required: [true, 'Поле описания обязательно для заполнения']
                    },
                ky:
                    {
                        type: String,
                        required: true,
                    }
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
                required: true,
            },
            characteristics: {
                type: [CharacteristicItemSchema],
                required: true,
            },
            sale: {
                isOnSale: {type: Boolean, required: true, default: false},
                label: {
                    ru: {type: String, default: null, maxLength: 150},
                    ky: {type: String, default: null}
                }
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

const Product = mongoose.model<ProductDocument>('Product', ProductSchema);
export default Product;
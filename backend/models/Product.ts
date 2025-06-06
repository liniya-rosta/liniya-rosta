import mongoose from "mongoose";
import Category from "./Category";

const Schema = mongoose.Schema;

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
    description: {
        type: String,
        default: null,
    },
    image: {
        type: String,
        default: null,
    },
});


const Product = mongoose.model('Product', ProductSchema);
export default Product;
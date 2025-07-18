import mongoose from "mongoose";
import {ImageItem} from "../../types";

const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    image: { type: String, required: true },
    alt: { type: String, default: null, maxLength: 150 },
}, { _id: false });

const PostSchema = new Schema({
    title: {
        type: String,
        required: [true, "Поле заголовка обязательно для заполнения"],
    },
    description: {
        type: String,
        required: [true, "Поле описания обязательно для заполнения"],
    },
    images: {
        type: [ImageSchema],
        validate: {
            validator: (arr: ImageItem[]) => arr.length > 0,
            message: "Необходимо загрузить хотя бы одно изображение",
        },
        required: true,
    },
});

const Post = mongoose.model("Post", PostSchema);
export default Post;

import mongoose from "mongoose";

const Schema = mongoose.Schema;

const LaminateSchema = new Schema({
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
        required: [true, 'Фото обязательно для заполнения'],
    },
});


const LaminateItem = mongoose.model('LaminateItem', LaminateSchema);
export default LaminateItem;
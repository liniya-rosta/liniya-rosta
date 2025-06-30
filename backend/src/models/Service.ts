import mongoose, {Schema} from "mongoose";

const ServiceSchema = new Schema({
    title: {
        type: String,
        required: [true, "Поле заголовка обязательно для заполнения"],
    },
    description: {
        type: String,
        default: null,
    },
});

const Service = mongoose.model("Service", ServiceSchema);
export default Service;
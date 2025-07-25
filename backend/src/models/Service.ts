import mongoose, {Schema} from "mongoose";

const ServiceSchema = new Schema({
    title: {
        ru: {
            type: String,
            required: [true, "Поле заголовка обязательно для заполнения"],
        },
        ky: {
            type: String,
            required: true,
        }
    },
    description: {
        ru: {
            type: String,
            default: null,
        },
        ky: {
            type: String,
            default: null,
        }
    },
});

const Service = mongoose.model("Service", ServiceSchema);
export default Service;
import {model, Schema} from "mongoose";

const RequestSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    commentOfManager: {
        type: String,
        default: null,
    },
    status: {
        type: String,
        enum: {
            values: ['new', 'in_progress', 'done', 'rejected'],
            message: 'Недопустимый статус заявки',
        },
        default: 'new',
    }
}, { timestamps: true });

const RequestFromClient = model("Request", RequestSchema);
export default RequestFromClient;
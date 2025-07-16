import {model, Schema} from "mongoose";

const RequestSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Имя обязательно'],
    },
    phone: {
        type: String,
        required: [true, 'Номер обязателен'],
        validate: {
            validator: (value: string) => {
                const onlyDigits = value.replace(/\D/g, '');
                const containsLetters = /[a-zA-Zа-яА-Я]/.test(value);

                return onlyDigits.length >= 9 && !containsLetters;
            },
            message: "Номер телефона должен содержать минимум 9 цифр и не должен включать буквы",
        },
    },
    email: {
        type: String,
        required: [true, 'Email обязателен'],
        trim: true,
        validate: {
            validator: (value: string) => /^[\w.-]+@[\w.-]+\.\w{2,}$/.test(value),
            message: "Некорректный email" ,
        },
    },
    commentOfManager: {
        type: String,
        default: null,
    },
    status: {
        type: String,
        enum: {
            values: ['Новая', 'В работе', 'Завершена', 'Отклонена'],
            message: 'Недопустимый статус заявки',
        },
        default: 'Новая',
    },
    isArchived: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

const RequestFromClient = model("Request", RequestSchema);
export default RequestFromClient;
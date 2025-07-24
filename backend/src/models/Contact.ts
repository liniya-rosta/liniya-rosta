import mongoose from "mongoose";
import {ContactFields} from "../../types";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ContactSchema = new mongoose.Schema<ContactFields>({
    location: {
            ru: {
                type: String,
                required: true,
                validator: (v: string) => v.trim().length > 0,
                message: "Поле обязательно для заполнения"},
            ky: {
                type: String,
                required: true,
                }
    },
    phone1: {type: String, required: true},
    phone2: {type: String},
    email: {
        type: String,
        required: true,
        validate: {
            validator: function (value: string) {
                return emailRegex.test(value);
            },
            message: "Неверный формат email",
        },
    },
    workingHours: {
        monday: {
            ru: { type: String, required: true },
            ky: { type: String, required: true },
        },
        tuesday: {
            ru: { type: String, required: true },
            ky: { type: String, required: true },
        },
        wednesday: {
            ru: { type: String, required: true },
            ky: { type: String, required: true },
        },
        thursday: {
            ru: { type: String, required: true },
            ky: { type: String, required: true },
        },
        friday: {
            ru: { type: String, required: true },
            ky: { type: String, required: true },
        },
        saturday: {
            ru: { type: String, required: true },
            ky: { type: String, required: true },
        },
        sunday: {
            ru: { type: String, required: true },
            ky: { type: String, required: true },
        },
    },
    mapLocation: {type: String, required: true},
    linkLocation: {type: String, required: true},
    instagram: {type: String, required: true},
    whatsapp: {type: String, required: true},
});


const Contact = mongoose.model<ContactFields>("Contact", ContactSchema);
export default Contact;

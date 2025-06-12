import mongoose from "mongoose";
import {ContactFields} from "../../types";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ContactSchema = new mongoose.Schema<ContactFields>({
    location: {type: String, required: true},
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
        monday: {type: String, required: true},
        tuesday: {type: String, required: true},
        wednesday: {type: String, required: true},
        thursday: {type: String, required: true},
        friday: {type: String, required: true},
        saturday: {type: String, required: true},
        sunday: {type: String, required: true},
    },
    mapLocation: {type: String, required: true},
    linkLocation: {type: String, required: true},
    instagram: {type: String, required: true},
    whatsapp: {type: String, required: true},
});


const Contact = mongoose.model<ContactFields>("Contact", ContactSchema);
export default Contact;

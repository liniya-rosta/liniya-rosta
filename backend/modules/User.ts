import mongoose, { HydratedDocument, Model } from "mongoose";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { UserFields } from "../types";

interface UserMethods {
    checkPassword: (password: string) => Promise<boolean>;
    generateAccessToken: () => string;
    generateRefreshToken: () => string;
}

const JWT_SECRET = process.env.JWT_SECRET || "default_fallback_secret";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "default_refresh_secret";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type UserModel = Model<UserFields, {}, UserMethods>;

const UserSchema = new mongoose.Schema<HydratedDocument<UserFields>, UserModel, UserMethods>({
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: (value: string) => emailRegex.test(value),
            message: "This email is invalid",
        },
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        enum: ["user", "admin", "superadmin"],
        default: "user",
    },
    displayName: {
        type: String,
        required: true,
    },
    refreshToken: {
        type: String,
        default: "",  // не обязательный при создании
    },
});

UserSchema.methods.checkPassword = async function (password: string) {
    return await argon2.verify(this.password, password);
};

UserSchema.methods.generateAccessToken = function () {
    return jwt.sign({ _id: this._id, role: this.role }, JWT_SECRET, { expiresIn: "15m" }); // короткий access token
};

UserSchema.methods.generateRefreshToken = function () {
    return jwt.sign({ _id: this._id, role: this.role }, JWT_REFRESH_SECRET, { expiresIn: "7d" }); // долгий refresh token
};

UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await argon2.hash(this.password, {
        type: argon2.argon2id,
        memoryCost: 2 ** 16,
        timeCost: 5,
        parallelism: 1,
    });
    next();
});

UserSchema.set("toJSON", {
    transform: (_doc, ret) => {
        delete ret.password;
        delete ret.refreshToken;
        return ret;
    },
});

const User = mongoose.model("User", UserSchema);
export default User;

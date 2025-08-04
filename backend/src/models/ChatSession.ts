import mongoose, { Schema } from "mongoose";

const MessageSchema = new Schema({
    sender: {
        type: String,
        enum: ["client", "admin"],
        required: true
    },
    senderName: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
});

const ChatSessionSchema = new Schema({
    clientName: {
        type: String,
        required: true
    },
    adminId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    messages: [MessageSchema],
}, { timestamps: true });

const ChatSession = mongoose.model("ChatSession", ChatSessionSchema);
export default ChatSession;

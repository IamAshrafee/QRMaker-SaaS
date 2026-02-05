import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: { type: String },
    password: { type: String }, // Optional for social login
    role: {
        type: String,
        enum: ["user", "admin", "superadmin"],
        default: "user"
    },
    plan: {
        type: String,
        enum: ["free", "basic", "pro"],
        default: "free"
    },
    provider: { type: String, default: "credentials" },
    createdAt: { type: Date, default: Date.now },
});

// Prevent model overwrite in development
export const User = mongoose.models.User || mongoose.model("User", UserSchema);

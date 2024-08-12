import * as mongoose from "mongoose";
import User from "../interfaces/userModel.interface";

const addressSchema = new mongoose.Schema({
    city: String,
    country: String,
    street: String,
});

const userSchema = new mongoose.Schema(
    {
        address: addressSchema,
        email: String,
        firstName: String,
        lastName: String,
        accessToken: String,
        password: {
            type: String,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
        isActive: {
            type: Boolean,
            default: false,
        },
        createdAt: Number,
        updatedAt: Number,
        deletedAt: Number,
        createdBy: {
            type: mongoose.Schema.ObjectId,
        },
        deletedBy: {
            type: mongoose.Schema.ObjectId,
        },
        updatedBy: {
            type: {
                type: mongoose.Schema.ObjectId,
            },
        },
    },
    {
        toJSON: {
            virtuals: true,
            getters: true,
        },
    }
);

userSchema.virtual("fullName").get(function () {
    return `${this.firstName} ${this.lastName}`;
});

const userModel = mongoose.model<User & mongoose.Document>("User", userSchema);

export default userModel;

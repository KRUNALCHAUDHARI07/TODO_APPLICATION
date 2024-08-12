import mongoose from "mongoose";

interface User {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    address?: {
        city?: string;
        country?: string;
        street?: string;
    };
    accessToken?: string;
    password?: string;
    isDeleted?: boolean;
    isActive?: boolean;
    createdAt?: Number,
    updatedAt?: Number,
    deletedAt?: Number,
    createdBy?: mongoose.Types.ObjectId;
    deletedBy?: mongoose.Types.ObjectId;
    updatedBy?: mongoose.Types.ObjectId;
}
export default User;
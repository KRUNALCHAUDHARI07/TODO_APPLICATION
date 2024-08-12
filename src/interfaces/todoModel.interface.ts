import mongoose from "mongoose";
interface Todo {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    isDeleted?: boolean;
    isActive?: boolean;
    createdAt?: Number,
    updatedAt?: Number,
    deletedAt?: Number,
    createdBy?: mongoose.Types.ObjectId;
    deletedBy?: mongoose.Types.ObjectId;
    updatedBy?: mongoose.Types.ObjectId;

}

export default Todo;

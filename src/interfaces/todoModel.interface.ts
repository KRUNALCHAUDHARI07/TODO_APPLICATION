import mongoose from "mongoose";
interface Todo {
    _id: string;
    name: string;
    description: string;
    userId: string;
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

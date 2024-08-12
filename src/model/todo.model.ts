import * as mongoose from "mongoose";
import Todo from "../interfaces/todoModel.interface";
const todoSchema = new mongoose.Schema({
    name: String,
    firstName: String,
    description: String,
    userId: mongoose.Schema.ObjectId,
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
)

const todoModel = mongoose.model<Todo & mongoose.Document>("Task", todoSchema);
export default todoModel;


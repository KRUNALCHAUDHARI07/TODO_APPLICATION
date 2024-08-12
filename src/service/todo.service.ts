import todoModel from "./../model/todo.model";
import CreateTodoDto from "../dto/todo.dto";
import UserWithThatTaskExistsException from "../exceptions/UserWithThatTaskExistsException";
import UserWithThatTaskNotFoundException from "../exceptions/UserWithThatTaskNotFoundException";
import mongoose from "mongoose";

class TodoService {
    public todo = todoModel;

    public async create(userId: string, data: CreateTodoDto) {
        //check data exist
        const todoData = await todoModel.findOne({ name: data.name, isDeleted: false, userId });
        if (todoData) {
            throw new UserWithThatTaskExistsException();
        }

        //insert data
        const insertedData = {
            ...data,
            userId,
            createdAt: Math.floor(Date.now() / 1000)
        };

        const task = await this.todo.create(insertedData);

        return {
            task,
        };

    }

    public async get(userId: string) {
        const task = await this.todo.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId.toString()),
                    isDeleted: false
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            },
            {
                $project: {
                    name: 1,
                    description: 1,
                }
            }
        ]);
        // ({
        //     userId: new mongoose.Types.ObjectId('66b8b1c1bf9518927c8b8f05'),
        // });
        return {
            task,
        };
    }

    public async update(userId: string, id: string, data: CreateTodoDto) {
        //check task id
        const taskData = await this.todo.findOne({
            _id: new mongoose.Types.ObjectId(id),
            userId: userId.toString(),
            isDeleted: false
        });

        if (!taskData) {
            throw new UserWithThatTaskNotFoundException();
        }

        //update data
        await this.todo.findByIdAndUpdate({ _id: new mongoose.Types.ObjectId(id) }, {
            $set: {
                ...data,
                updatedAt: Math.floor(Date.now() / 1000),
                updatedBy: userId.toString()
            }
        });

        return { message: 'task updated successfully' }
    }

    public async delete(userId: string, id: string) {
        //check task id
        const taskData = await this.todo.findOne({
            _id: new mongoose.Types.ObjectId(id),
            userId: userId.toString(),
            isDeleted: false
        });

        if (!taskData) {
            throw new UserWithThatTaskNotFoundException();
        }

        //update data
        await this.todo.findByIdAndUpdate({ _id: new mongoose.Types.ObjectId(id) }, {
            $set: {
                isDeleted: true,
                deletedBy: userId.toString(),
                deletedAt: Math.floor(Date.now() / 1000),
                updatedAt: Math.floor(Date.now() / 1000),
                updatedBy: userId.toString()
            }
        });

        return { message: 'task deleted successfully' }
    }
}

export default TodoService
import { Request, Response, NextFunction, Router, RequestHandler } from "express";
import Controller from "../interfaces/controller.interface";
import validationMiddleware from "../middleware/validation.middleware";
import CreateTodoDto from "../dto/todo.dto";
import TodoService from "../service/todo.service";
import authMiddleware from '../middleware/userAuth.middleware';
import RequestWithUser from '../interfaces/requestWithUser.interface';

class TodoController implements Controller {
    public path = "/todo";
    public router = Router();
    public todoService = new TodoService();

    constructor() {
        this.router.post(
            `${this.path}/create`,
            authMiddleware as RequestHandler,
            validationMiddleware(CreateTodoDto),
            this.create as RequestHandler
        );
        this.router.get(
            `${this.path}/get`,
            authMiddleware as RequestHandler,
            this.get as RequestHandler
        );

        this.router.post(
            `${this.path}/update`,
            authMiddleware as RequestHandler,
            this.update as RequestHandler
        );

        this.router.delete(
            `${this.path}/delete/:id`,
            authMiddleware as RequestHandler,
            this.delete as RequestHandler
        );

    }

    private create = async (
        request: RequestWithUser,
        response: Response,
        next: NextFunction
    ) => {
        const userData: CreateTodoDto = request.body;
        try {
            const { task } = await this.todoService.create(
                request.user._id, userData
            );
            response.send(task);
        } catch (error) { next(error) }

    }
    private get = async (
        request: RequestWithUser,
        response: Response,
        next: NextFunction
    ) => {
        try {
            const { task } = await this.todoService.get(
                request.user._id,
            );
            response.send(task);
        } catch (error) {
            next(error)
        }

    }

    private update = async (
        request: RequestWithUser,
        response: Response,
        next: NextFunction
    ) => {
        const userData: CreateTodoDto = request.body;
        try {
            const { message } = await this.todoService.update(

                request.user._id,
                request.body.id,
                userData
            );
            response.send(message);
        } catch (error) {
            console.log('error: ', error);
            next(error)
        }
    }

    private delete = async (
        request: RequestWithUser,
        response: Response,
        next: NextFunction
    ) => {
        try {
            const { message } = await this.todoService.delete(

                request.user._id,
                request.params.id,
            );
            response.send(message);
        } catch (error) {
            console.log('error: ', error);
            next(error)
        }
    }
}
export default TodoController;

import { Request, Response, NextFunction, Router } from "express";
import Controller from "../interfaces/controller.interface";
import validationMiddleware from "../middleware/validation.middleware";
import CreateUserDto from "../dto/user.dto";
import LogInDto from "../dto/login.dto";
import AuthenticationService from "../service/authentication.service";
import authMiddleware from '../middleware/userAuth.middleware';
import RequestWithUser from '../interfaces/requestWithUser.interface';

class AuthController implements Controller {
    public path = "/auth";
    public router = Router();
    public authenticationService = new AuthenticationService();
    constructor() {
        this.router.post(
            `${this.path}/register`,
            validationMiddleware(CreateUserDto),
            this.registration
        );
        this.router.post(
            `${this.path}/login`,
            validationMiddleware(LogInDto),
            this.loggingIn
        );
        this.router.get(`${this.path}/profile`, authMiddleware, this.getUserById);

    }

    private registration = async (
        request: Request,
        response: Response,
        next: NextFunction
    ) => {
        const userData: CreateUserDto = request.body;
        try {
            const { user } = await this.authenticationService.register(
                userData
            );
            response.send(user);
        } catch (error) { next(error) }
    };

    private loggingIn = async (
        request: Request,
        response: Response,
        next: NextFunction
    ) => {
        const { user } = await this.authenticationService.login(
            request.body
        );
        response.send(user);
    };

    private getUserById = async (
        request: RequestWithUser,
        response: Response,
        next: NextFunction
    ) => {
        const { user } = await this.authenticationService.profile(
            request.user
        );
        response.send(user);
    };


}

export default AuthController;

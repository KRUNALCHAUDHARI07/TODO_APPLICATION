import { NextFunction, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import AuthenticationTokenMissingException from '../exceptions/AuthenticationTokenMissingException';
import WrongAuthenticationTokenException from '../exceptions/WrongAuthenticationTokenException';
import DataStoredInToken from '../interfaces/dataStoredInToken';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import userModel from '../model/user.model';

async function authMiddleware(
    request: RequestWithUser,
    response: Response,
    next: NextFunction
) {
    const authHeader = request.headers['authorization'];

    if (authHeader) {
        const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader; // Extract token if in 'Bearer' format
        const secret = process.env.JWT_SECRET;

        try {
            const verificationResponse = jwt.verify(token, secret) as DataStoredInToken;
            const id = verificationResponse._id;
            const user = await userModel.findById(id);

            if (user) {
                request.user = user;
                next();
            } else {
                next(new WrongAuthenticationTokenException());
            }
        } catch (error) {
            next(new WrongAuthenticationTokenException());
        }
    } else {
        next(new AuthenticationTokenMissingException());
    }
}

export default authMiddleware;


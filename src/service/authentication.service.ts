import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import userModel from "./../model/user.model";
import UserWithThatEmailAlreadyExistsException from "../exceptions/UserWithThatEmailAlreadyExistsException";
import UserWithThatEmailNotExistsException from "../exceptions/UserWithThatEmailNotExistsException";
import WrongPasswordException from "../exceptions/WrongPasswordException";
import CreateUserDto from "../dto/user.dto";
import UserLoginDto from "../dto/userLogin.dto";
import TokenData from "../interfaces/tokenData.interface";
import User from "../interfaces/user.interface";
import DataStoredInToken from '../interfaces/dataStoredInToken';

class AuthenticationService {
    public user = userModel;
    public async register(userData: CreateUserDto) {
        if (await this.user.findOne({ email: userData.email, isDeleted: false })) {
            throw new UserWithThatEmailAlreadyExistsException(userData.email);
        }
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const user = await this.user.create({
            ...userData,
            password: hashedPassword,
        });
        const tokenData = this.createToken(user);
        return {
            user,
        };
    }

    public createCookie(tokenData: TokenData) {
        return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
    }
    public createToken(user: User): TokenData {
        const expiresIn = 60 * 60; // an hour
        const secret = process.env.JWT_SECRET;
        const dataStoredInToken: DataStoredInToken = {
            _id: user._id,
        };
        return {
            expiresIn,
            token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
        };
    }

    public async login(userData: UserLoginDto) {

        let loggedInUserData = await this.user.findOne({ email: userData.email, isDeleted: false });
        if (!loggedInUserData) {
            throw new UserWithThatEmailNotExistsException(userData.email);
        }

        //compare password
        const comparePassword = await bcrypt.compare(userData.password, loggedInUserData.password)
        if (!comparePassword) {
            throw new WrongPasswordException();
        }

        const tokenData = this.createToken(loggedInUserData);

        //add token in data
        await this.user.updateOne({ _id: loggedInUserData }, {
            accessToken: tokenData.token,
            updatedAt: Math.floor((Date.now() / 1000))
        });
        let user = await this.user.findOne({ email: userData.email });

        return {
            user,
        };



    }
    public async profile(token: User) {
        console.log('token: ', token);
        let userData = await this.user.findOne({ _id: token._id });
        if (!userData) {
            throw new UserWithThatEmailNotExistsException(userData.email);
        }

        return {
            user: userData,
        };
    }
}

export default AuthenticationService;

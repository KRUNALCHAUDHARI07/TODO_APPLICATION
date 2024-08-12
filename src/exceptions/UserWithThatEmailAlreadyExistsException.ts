import HttpException from "./HttpException";

class UserWithThatEmailAlreadyExistsException extends HttpException {
    constructor(email: string) {
        super(400, `User with email ${email} not exists`);
    }
}

export default UserWithThatEmailAlreadyExistsException;

import HttpException from "./HttpException";

class WrongPasswordException extends HttpException {
    constructor() {
        super(400, `User enter wrong password`);
    }
}

export default WrongPasswordException;

import HttpException from './HttpException';

class UserWithThatTaskNotFoundException extends HttpException {
    constructor() {
        super(400, 'task is not found');
    }
}

export default UserWithThatTaskNotFoundException;

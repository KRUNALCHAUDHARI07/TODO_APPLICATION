import HttpException from './HttpException';

class UserWithThatTaskExistsException extends HttpException {
    constructor() {
        super(404, 'task is already exist');
    }
}

export default UserWithThatTaskExistsException;

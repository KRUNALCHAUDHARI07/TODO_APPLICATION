import "dotenv/config";
import App from "./app";
import AuthController from './controller/auth.controller';
import TodoController from './controller/todo.controller';

const app = new App([
  new AuthController(),
  new TodoController(),
]);

app.listen();

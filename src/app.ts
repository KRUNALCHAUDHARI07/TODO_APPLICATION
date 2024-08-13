import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as mongoose from 'mongoose';
import { Server as HttpServer } from 'http'; // Import HTTP Server
import { Server as SocketIOServer } from 'socket.io'; // Import Socket.io Server
import Controller from './interfaces/controller.interface';
import errorMiddleware from './middleware/error.middleware';
import CheckUser from 'helper/checkUser.helper';

class App {
  public app: express.Application;
  public io: SocketIOServer; // Socket.io server instance

  private httpServer: HttpServer; // HTTP server instance

  constructor(controllers: Controller[]) {
    this.app = express();
    this.httpServer = new HttpServer(this.app); // Create HTTP server with Express app
    this.io = new SocketIOServer(this.httpServer); // Create Socket.io server with HTTP server

    this.connectToTheDatabase();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.initializeSocketIO(); // Initialize Socket.io
    this.initializeErrorHandling();
  }

  public listen() {
    this.httpServer.listen(process.env.PORT, () => {
      console.log(`App listening on the port ${process.env.PORT}`);
    });
  }

  public getServer() {
    return this.app;
  }

  private initializeMiddlewares() {
    this.app.use(bodyParser.json());
    this.app.use(cookieParser());
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  private initializeControllers(controllers: Controller[]) {
    controllers.forEach((controller) => {
      this.app.use("/", controller.router);
    });
  }

  private initializeSocketIO() {
    this.io.on('connection', (socket) => {
      console.log('A user connected');

      socket.on('joinRoom', async (userId: string) => {
        //check userId
        const checkUserId = await CheckUser(userId)
        if (checkUserId) {
          socket.join(userId);
        } else {
          socket.emit('notJoin', userId)
        }
      })

      socket.on('addTask', (task) => {
        //get task data from client and socket send task details and client add task in list
        socket.to(task.userId).emit('getTask', task);
      })

      socket.on('disconnect', () => {
        console.log('User disconnected');
      });

      // Handle custom events
      socket.on('message', (data) => {
        console.log('Message received:', data);
        socket.emit('response', 'Message received');
      });
    });
  }

  private connectToTheDatabase() {
    const { MONGO_USER, MONGO_PASSWORD, MONGO_PATH } = process.env;
    mongoose.connect(`mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}?retryWrites=true&w=majority`)
      .then(() => console.log('MongoDB connected successfully'))
      .catch(err => {
        console.error('MongoDB connection error:', err);
      });
  }
}

export default App;

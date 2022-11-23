import express from 'express';
import cors from 'cors';
import path from 'path';
const PORT = process.env.PORT || 3001;
import consoleLogger from './src/config/consoleLogger';
const console = consoleLogger(module);
import { message, room } from './src/routes';
import { NODE_ENV, SERVER_VERSION } from './src/config';
import { errorhandler } from './src/middleware';
// eslint-disable-next-line no-unused-vars
// import connectDB from './src/config/db.config'; //for connect to db you need to add credential in env

const app = express();

// uncatchException handle here
process.on('uncaughtException', (err) => {
  console.info('Shutting down the server due to uncaught exception', err);
  process.exit(1);
});

// middleware setup
app.use(cors());
// app.use(morganMiddleware);  //not working with winston , without winston working
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
const baseUrl = `/api/${SERVER_VERSION}`;

app.get('/', (req, res) => {
  // httpLogger.http('Hello, world!');
  res.status(200).json({
    success: true,
    message: 'Server is running',
  });
});

// setup routes
app.use(baseUrl, message);
app.use(baseUrl, room);
app.use(errorhandler);

// listing the port
const server = app.listen(PORT, () => {
  console.info(`Server started and running on port:${PORT} in ${NODE_ENV}`);
});

// Hanlde unhandle promise rejection handle
process.on('unhandledRejection', (err) => {
  console.info(
    'Shutting down the server due to the unhandledRejection',
    err.message
  );
  server.close(() => {
    process.exit(1);
  });
});

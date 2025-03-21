import 'express-async-errors'
import express, { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { AppError } from './utils/AppError';
import { routes } from './routes';
import { UPLOADS_FOLDER } from './config/upload';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:5173", "https://food-explorer-api-ypvr.onrender.com"],
  credentials: true
}));

app.use(routes);

app.use("/files", express.static(UPLOADS_FOLDER));

const errorHandler: ErrorRequestHandler = (
  error,
  request,
  response,
  next
): void => {
  if (error instanceof AppError) {
    response.status(error.statusCode).json({
      status: "error",
      message: error.message,
    });
    return;
  }

  console.error(error);

  response.status(500).json({
    status: "error",
    message: "Internal server error",
  });

  return;
};

app.use(errorHandler);


const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

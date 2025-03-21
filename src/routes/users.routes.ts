import { Router, Request, Response, RequestHandler, NextFunction } from "express";
import { UsersController } from "../controllers/UsersController";
import { UsersValidatedController } from "../controllers/UsersValidatedController";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

const usersRoutes = Router();
const usersController = new UsersController();
const usersValidatedController = new UsersValidatedController();

const createHandler: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  await usersController.create(req, res, next);
};

const updateHandler: RequestHandler = async (req: Request, res: Response) => {
  await usersController.update(req, res);
};

const validatedHandler: RequestHandler = async (req: Request, res: Response) => {
  await usersValidatedController.index(req, res);
};

usersRoutes.post("/", createHandler);
usersRoutes.put("/", ensureAuthenticated, updateHandler);
usersRoutes.get("/validated", ensureAuthenticated, validatedHandler);

export { usersRoutes };
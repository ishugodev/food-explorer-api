import { Router, Request, Response } from "express";
import SessionsController from "../controllers/SessionsController";

const sessionsController = new SessionsController();
const sessionsRoutes = Router();

const createHandler = async (req: Request, res: Response) => {
  await sessionsController.create(req, res);
};

sessionsRoutes.post("/", createHandler);

export { sessionsRoutes };
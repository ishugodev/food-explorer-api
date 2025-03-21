import { Router, Request, Response } from "express";
import IngredientsController from "../controllers/IngredientsController";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

const ingredientsRoutes = Router();
const ingredientsController = new IngredientsController();

const indexHandler = async (req: Request, res: Response) => {
  await ingredientsController.index(req, res);
};

ingredientsRoutes.use(ensureAuthenticated);

ingredientsRoutes.get("/", indexHandler);

export { ingredientsRoutes };
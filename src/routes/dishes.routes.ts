import { Router, Request, Response } from "express";

import multer from "multer";
import * as uploadConfig from "../config/upload";

import DishesController from "../controllers/DishesController";
import DishImageController from "../controllers/DishImageController";

import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import verifyUserAuthorization from "../middlewares/verifyUserAuthorization";

const dishesRoutes = Router();
const dishesController = new DishesController();
const dishImageController = new DishImageController();
const upload = multer(uploadConfig.MULTER);


const createHandler = async (req: Request, res: Response) => {
  await dishesController.create(req, res);
};

const updateHandler = async (req: Request, res: Response) => {
  await dishesController.update(req, res);
};

const indexHandler = async (req: Request, res: Response) => {
  await dishesController.index(req, res);
};

const showHandler = async (req: Request, res: Response) => {
  await dishesController.show(req, res);
};

const deleteHandler = async (req: Request, res: Response) => {
  await dishesController.delete(req, res);
};

const imageUpdateHandler = async (req: Request, res: Response) => {
  await dishImageController.update(req, res);
};

dishesRoutes.use(ensureAuthenticated);

dishesRoutes.post("/", verifyUserAuthorization(["admin"]), upload.single("image"), createHandler);
dishesRoutes.put("/:id", verifyUserAuthorization(["admin"]), upload.single("image"), updateHandler);
dishesRoutes.get("/", indexHandler);
dishesRoutes.get("/:id", showHandler);
dishesRoutes.delete("/:id", verifyUserAuthorization(["admin"]), deleteHandler);
dishesRoutes.patch("/:id/image", verifyUserAuthorization(["admin"]), upload.single("image"), imageUpdateHandler);

export { dishesRoutes };
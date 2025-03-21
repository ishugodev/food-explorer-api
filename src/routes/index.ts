import { Router } from "express";

import { usersRoutes } from "./users.routes";
import { dishesRoutes } from "./dishes.routes";
import { ingredientsRoutes } from "./ingredients.routes";
import { sessionsRoutes } from "./sessions.routes";

const routes = Router();

routes.use("/users", usersRoutes);
routes.use("/dishes", dishesRoutes);
routes.use("/ingredients", ingredientsRoutes);
routes.use("/sessions", sessionsRoutes);

export { routes };

import { Request, Response } from "express";
import knex from "../database/knex";

interface Ingredient {
  name: string;
  user_id: number;
}

export class IngredientsController {
  async index(request: Request, response: Response) {
    const { user } = request as Request & { user?: { id: number; role: string } };
    const user_id = user?.id;

    const ingredient = await knex("ingredients")
      .where({ user_id })
      .groupBy("name")
      .orderBy("name");

    return response.json({ ingredient });
  }
}

export default IngredientsController;
import { Request, Response } from "express";
import knex from "../database/knex";
import { AppError } from "../utils/AppError";

export class UsersValidatedController {
  async index(request: Request, response: Response) {
    const { user } = request as Request & { user?: { id: number; role: string } };
    const user_id = user?.id;

    const checkUserExists = await knex("users").where({ id: user_id });

    if (!checkUserExists) {
      throw new AppError("Unauthorized", 401);
    }

    return response.status(200).json();
  }
}
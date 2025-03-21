import { Request, Response } from "express";
import knex from "../database/knex";
import { AppError } from "../utils/AppError";
import { DiskStorage } from "../providers/DiskStorage";

class DishImageController {
  async update(request: Request, response: Response) {
    const { id } = request.params;

    const diskStorage = new DiskStorage();

    const dishFromDb = await knex("dishes").where({ id }).first();

    if (!dishFromDb) {
      throw new AppError("Prato não encontrado!", 404);
    }

    if (dishFromDb.image) {
      await diskStorage.deleteFile(dishFromDb.image);
    }

    const filename = await diskStorage.saveFile(request.file!);
    dishFromDb.image = filename;

    await knex("dishes").update(dishFromDb).where({ id });

    return response.json(dishFromDb);
  }
}

export default DishImageController;
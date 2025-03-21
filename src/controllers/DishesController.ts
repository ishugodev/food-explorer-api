import { Request, Response } from 'express';
import knex from '../database/knex';
import { DiskStorage } from '../providers/DiskStorage';
import { AppError } from '../utils/AppError';

interface Dish {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  user_id: number;
}

export class DishesController {
  async create(request: Request, response: Response) {
    const { name, category, ingredients, price, description } = request.body;
  
    const ingredientsArray = typeof ingredients === "string" ? ingredients.split(",") : ingredients || [];

    const [dish_id] = await knex("dishes").insert({
      name,
      category,
      price,
      description,
    });

    const ingredientsInsert = ingredientsArray.map((name: string) => ({
      dish_id,
      name,
    }));

    await knex("ingredients").insert(ingredientsInsert);

    const diskStorage = new DiskStorage();

    if (request.file) {
      const filename = await diskStorage.saveFile(request.file);
      await knex("dishes").update({ image: filename }).where({ id: dish_id });
    }

    const dish = await knex("dishes").where({ id: dish_id }).first();
    const dishIngredients = await knex("ingredients").where({ dish_id }).orderBy("name");

    return response.json({
      ...dish,
      ingredients: dishIngredients,
    });
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;
    const { name, category, ingredients, price, description } = request.body;

    await knex("dishes").where({ id }).update({
      name,
      category,
      price,
      description,
    });

    await knex("ingredients").where({ dish_id: id }).del();

    const ingredientsArray = typeof ingredients === "string" 
    ? ingredients.split(",").map((ingredient: string) => ingredient.trim()) 
    : [];


    const ingredientsInsert = ingredientsArray.map((name: string) => ({
      dish_id: id,
      name,
    }));

    await knex("ingredients").insert(ingredientsInsert);
   
    // Image
    const diskStorage = new DiskStorage();

    const dishFromDb = await knex("dishes").where({ id }).first();

    if (!dishFromDb) {
      throw new AppError("Prato não encontrado!", 404);
    }

    if (request.file) {
      if (dishFromDb.image) {
        await diskStorage.deleteFile(dishFromDb.image);
      }
      const filename = await diskStorage.saveFile(request.file);
      dishFromDb.image = filename;
    } else if (!dishFromDb.image && request.body.image) {
      dishFromDb.image = request.body.image;
    }

    await knex("dishes").where({ id }).update({
      name,
      category,
      price,
      description,
      image: dishFromDb.image,
    });

    return response.json(dishFromDb);
  }

  async show(request: Request, response: Response) {
    const { id } = request.params;

    const dish = await knex("dishes").where({ id }).first();
    const ingredients = await knex("ingredients").where({ dish_id: id }).orderBy("name");

    return response.json({
      ...dish,
      ingredients,
    });
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params;

    await knex("dishes").where({ id }).delete();

    return response.json();
  }

  async index(request: Request, response: Response) {
    const { name, ingredients } = request.query;

    let dishes: Dish[];

    if (ingredients) {
      const filterIngredients = (ingredients as string).split(",").map(ingredient => ingredient.trim());

      dishes = await knex("dishes")
        .select(["dishes.id", "dishes.name", "dishes.user_id"])
        .whereLike("dishes.name", `%${name}%`)
        .whereIn("ingredients.name", filterIngredients)
        .innerJoin("ingredients", "dishes.id", "ingredients.dish_id")
        .groupBy("dishes.id")
        .orderBy("dishes.name");
    } else {
      dishes = await knex("dishes")
        .whereLike("name", `%${name}%`)
        .orderBy("name");
    }

    return response.json(dishes);
  }
}

export default DishesController;
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DishesController = void 0;
const knex_1 = __importDefault(require("../database/knex"));
const DiskStorage_1 = require("../providers/DiskStorage");
const AppError_1 = require("../utils/AppError");
class DishesController {
    create(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, category, ingredients, price, description } = request.body;
            const ingredientsArray = typeof ingredients === "string" ? ingredients.split(",") : ingredients || [];
            const [dish_id] = yield (0, knex_1.default)("dishes").insert({
                name,
                category,
                price,
                description,
            });
            const ingredientsInsert = ingredientsArray.map((name) => ({
                dish_id,
                name,
            }));
            yield (0, knex_1.default)("ingredients").insert(ingredientsInsert);
            const diskStorage = new DiskStorage_1.DiskStorage();
            if (request.file) {
                const filename = yield diskStorage.saveFile(request.file);
                yield (0, knex_1.default)("dishes").update({ image: filename }).where({ id: dish_id });
            }
            const dish = yield (0, knex_1.default)("dishes").where({ id: dish_id }).first();
            const dishIngredients = yield (0, knex_1.default)("ingredients").where({ dish_id }).orderBy("name");
            return response.json(Object.assign(Object.assign({}, dish), { ingredients: dishIngredients }));
        });
    }
    update(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = request.params;
            const { name, category, ingredients, price, description } = request.body;
            yield (0, knex_1.default)("dishes").where({ id }).update({
                name,
                category,
                price,
                description,
            });
            yield (0, knex_1.default)("ingredients").where({ dish_id: id }).del();
            const ingredientsArray = typeof ingredients === "string"
                ? ingredients.split(",").map((ingredient) => ingredient.trim())
                : [];
            const ingredientsInsert = ingredientsArray.map((name) => ({
                dish_id: id,
                name,
            }));
            yield (0, knex_1.default)("ingredients").insert(ingredientsInsert);
            // Image
            const diskStorage = new DiskStorage_1.DiskStorage();
            const dishFromDb = yield (0, knex_1.default)("dishes").where({ id }).first();
            if (!dishFromDb) {
                throw new AppError_1.AppError("Prato não encontrado!", 404);
            }
            if (request.file) {
                if (dishFromDb.image) {
                    yield diskStorage.deleteFile(dishFromDb.image);
                }
                const filename = yield diskStorage.saveFile(request.file);
                dishFromDb.image = filename;
            }
            else if (!dishFromDb.image && request.body.image) {
                dishFromDb.image = request.body.image;
            }
            yield (0, knex_1.default)("dishes").where({ id }).update({
                name,
                category,
                price,
                description,
                image: dishFromDb.image,
            });
            return response.json(dishFromDb);
        });
    }
    show(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = request.params;
            const dish = yield (0, knex_1.default)("dishes").where({ id }).first();
            const ingredients = yield (0, knex_1.default)("ingredients").where({ dish_id: id }).orderBy("name");
            return response.json(Object.assign(Object.assign({}, dish), { ingredients }));
        });
    }
    delete(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = request.params;
            yield (0, knex_1.default)("dishes").where({ id }).delete();
            return response.json();
        });
    }
    index(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, ingredients } = request.query;
            let dishes;
            if (ingredients) {
                const filterIngredients = ingredients.split(",").map(ingredient => ingredient.trim());
                dishes = yield (0, knex_1.default)("dishes")
                    .select(["dishes.id", "dishes.name", "dishes.user_id"])
                    .whereLike("dishes.name", `%${name}%`)
                    .whereIn("ingredients.name", filterIngredients)
                    .innerJoin("ingredients", "dishes.id", "ingredients.dish_id")
                    .groupBy("dishes.id")
                    .orderBy("dishes.name");
            }
            else {
                dishes = yield (0, knex_1.default)("dishes")
                    .whereLike("name", `%${name}%`)
                    .orderBy("name");
            }
            return response.json(dishes);
        });
    }
}
exports.DishesController = DishesController;
exports.default = DishesController;

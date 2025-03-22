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
const knex_1 = __importDefault(require("../database/knex"));
const AppError_1 = require("../utils/AppError");
const DiskStorage_1 = require("../providers/DiskStorage");
class DishImageController {
    update(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = request.params;
            const diskStorage = new DiskStorage_1.DiskStorage();
            const dishFromDb = yield (0, knex_1.default)("dishes").where({ id }).first();
            if (!dishFromDb) {
                throw new AppError_1.AppError("Prato não encontrado!", 404);
            }
            if (dishFromDb.image) {
                yield diskStorage.deleteFile(dishFromDb.image);
            }
            const filename = yield diskStorage.saveFile(request.file);
            dishFromDb.image = filename;
            yield (0, knex_1.default)("dishes").update(dishFromDb).where({ id });
            return response.json(dishFromDb);
        });
    }
}
exports.default = DishImageController;

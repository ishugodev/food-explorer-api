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
exports.UsersController = void 0;
const knex_1 = __importDefault(require("../database/knex"));
const bcryptjs_1 = require("bcryptjs");
const AppError_1 = require("../utils/AppError");
class UsersController {
    create(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, email, password } = request.body;
            const checkUserExists = yield (0, knex_1.default)("users").where({ email });
            if (checkUserExists.length > 0) {
                throw new AppError_1.AppError("Este e-mail já está em uso!");
            }
            const hashedPassword = yield (0, bcryptjs_1.hash)(password, 8);
            yield (0, knex_1.default)("users").insert({
                name,
                email,
                password: hashedPassword
            });
            return response.status(201).json({ message: "Usuário criado com sucesso!" });
        });
    }
    update(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, email, password, old_password } = request.body;
            const { user } = request;
            const user_id = user === null || user === void 0 ? void 0 : user.id;
            if (!user) {
                throw new AppError_1.AppError("Usuário não autenticado!", 401);
            }
            const userFromDb = yield (0, knex_1.default)("users")
                .where({ id: user_id })
                .first();
            if (!userFromDb) {
                throw new AppError_1.AppError("Usuário não encontrado!");
            }
            const userWithUpdatedEmail = yield (0, knex_1.default)("users")
                .where({ email })
                .whereNot({ id: user_id })
                .first();
            if (userWithUpdatedEmail) {
                throw new AppError_1.AppError("Este e-mail já está em uso!");
            }
            userFromDb.name = name !== null && name !== void 0 ? name : userFromDb.name;
            userFromDb.email = email !== null && email !== void 0 ? email : userFromDb.email;
            if (password && !old_password) {
                throw new AppError_1.AppError("Você precisa informar a senha antiga para atualizar.");
            }
            if (password && old_password) {
                const checkOldPassword = yield (0, bcryptjs_1.compare)(old_password, userFromDb.password);
                if (!checkOldPassword) {
                    throw new AppError_1.AppError("Senha antiga inválida!");
                }
                userFromDb.password = yield (0, bcryptjs_1.hash)(password, 8);
            }
            yield (0, knex_1.default)("users")
                .where({ id: user_id })
                .update({
                name: userFromDb.name,
                email: userFromDb.email,
                password: userFromDb.password,
                updated_at: knex_1.default.fn.now()
            });
            return response.json();
        });
    }
}
exports.UsersController = UsersController;

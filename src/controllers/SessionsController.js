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
exports.SessionsController = void 0;
const bcryptjs_1 = require("bcryptjs");
const jsonwebtoken_1 = require("jsonwebtoken");
const AppError_1 = require("../utils/AppError");
const knex_1 = __importDefault(require("../database/knex"));
const auth_1 = __importDefault(require("../config/auth"));
class SessionsController {
    create(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = request.body;
            const user = yield (0, knex_1.default)("users").where({ email }).first();
            if (!user) {
                throw new AppError_1.AppError("E-mail e/ou senha incorreta.", 401);
            }
            const passwordMatched = yield (0, bcryptjs_1.compare)(password, user.password);
            if (!passwordMatched) {
                throw new AppError_1.AppError("E-mail e/ou senha incorreta.", 401);
            }
            const { secret, expiresIn } = auth_1.default.jwt;
            const token = (0, jsonwebtoken_1.sign)({ role: user.role }, secret, {
                expiresIn: "1d",
                subject: user.id.toString()
            });
            response.cookie("token", token, {
                httpOnly: true,
                sameSite: "strict",
                secure: true,
                maxAge: 15 * 60 * 1000
            });
            const userWithoutPassword = {
                id: user.id,
                email: user.email,
                role: user.role
            };
            return response.status(201).json({ user: userWithoutPassword });
        });
    }
}
exports.SessionsController = SessionsController;
exports.default = SessionsController;

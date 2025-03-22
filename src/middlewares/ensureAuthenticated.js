"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureAuthenticated = ensureAuthenticated;
const jsonwebtoken_1 = require("jsonwebtoken");
const AppError_1 = require("../utils/AppError");
const auth_1 = __importDefault(require("../config/auth"));
function ensureAuthenticated(request, response, next) {
    const token = request.cookies.token;
    if (!token) {
        throw new AppError_1.AppError("JWT Token não informado.", 401);
    }
    try {
        const { role, sub: user_id } = (0, jsonwebtoken_1.verify)(token, auth_1.default.jwt.secret);
        request.user = {
            id: Number(user_id),
            role: role
        };
        return next();
    }
    catch (_a) {
        throw new AppError_1.AppError("JWT Token inválido.", 401);
    }
}

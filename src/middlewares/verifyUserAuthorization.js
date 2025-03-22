"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = require("../utils/AppError");
function verifyUserAuthorization(roleToVerify) {
    return (request, response, next) => {
        const { user } = request;
        const user_role = user === null || user === void 0 ? void 0 : user.role;
        if (!roleToVerify.includes(user_role)) {
            throw new AppError_1.AppError("Acesso negado.", 401);
        }
        return next();
    };
}
exports.default = verifyUserAuthorization;

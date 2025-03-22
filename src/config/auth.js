"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authConfig = {
    jwt: {
        secret: process.env.AUTH_SECRET || "default",
        expiresIn: "1d"
    }
};
exports.default = authConfig;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("express-async-errors");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const AppError_1 = require("./utils/AppError");
const routes_1 = require("./routes");
const upload_1 = require("./config/upload");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173", "https://food-explorer-api-ypvr.onrender.com"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));
app.use(routes_1.routes);
app.use("/files", express_1.default.static(upload_1.UPLOADS_FOLDER));
const errorHandler = (error, request, response, next) => {
    if (error instanceof AppError_1.AppError) {
        response.status(error.statusCode).json({
            status: "error",
            message: error.message,
        });
        return;
    }
    console.error(error);
    response.status(500).json({
        status: "error",
        message: "Internal server error",
    });
    return;
};
app.use(errorHandler);
const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

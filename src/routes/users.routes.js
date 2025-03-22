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
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRoutes = void 0;
const express_1 = require("express");
const UsersController_1 = require("../controllers/UsersController");
const UsersValidatedController_1 = require("../controllers/UsersValidatedController");
const ensureAuthenticated_1 = require("../middlewares/ensureAuthenticated");
const usersRoutes = (0, express_1.Router)();
exports.usersRoutes = usersRoutes;
const usersController = new UsersController_1.UsersController();
const usersValidatedController = new UsersValidatedController_1.UsersValidatedController();
const createHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield usersController.create(req, res, next);
});
const updateHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield usersController.update(req, res);
});
const validatedHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield usersValidatedController.index(req, res);
});
usersRoutes.post("/", createHandler);
usersRoutes.put("/", ensureAuthenticated_1.ensureAuthenticated, updateHandler);
usersRoutes.get("/validated", ensureAuthenticated_1.ensureAuthenticated, validatedHandler);

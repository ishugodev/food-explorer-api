"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.dishesRoutes = void 0;
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const uploadConfig = __importStar(require("../config/upload"));
const DishesController_1 = __importDefault(require("../controllers/DishesController"));
const DishImageController_1 = __importDefault(require("../controllers/DishImageController"));
const ensureAuthenticated_1 = require("../middlewares/ensureAuthenticated");
const verifyUserAuthorization_1 = __importDefault(require("../middlewares/verifyUserAuthorization"));
const dishesRoutes = (0, express_1.Router)();
exports.dishesRoutes = dishesRoutes;
const dishesController = new DishesController_1.default();
const dishImageController = new DishImageController_1.default();
const upload = (0, multer_1.default)(uploadConfig.MULTER);
const createHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield dishesController.create(req, res);
});
const updateHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield dishesController.update(req, res);
});
const indexHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield dishesController.index(req, res);
});
const showHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield dishesController.show(req, res);
});
const deleteHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield dishesController.delete(req, res);
});
const imageUpdateHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield dishImageController.update(req, res);
});
dishesRoutes.use(ensureAuthenticated_1.ensureAuthenticated);
dishesRoutes.post("/", (0, verifyUserAuthorization_1.default)(["admin"]), upload.single("image"), createHandler);
dishesRoutes.put("/:id", (0, verifyUserAuthorization_1.default)(["admin"]), upload.single("image"), updateHandler);
dishesRoutes.get("/", indexHandler);
dishesRoutes.get("/:id", showHandler);
dishesRoutes.delete("/:id", (0, verifyUserAuthorization_1.default)(["admin"]), deleteHandler);
dishesRoutes.patch("/:id/image", (0, verifyUserAuthorization_1.default)(["admin"]), upload.single("image"), imageUpdateHandler);

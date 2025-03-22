"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MULTER = exports.UPLOADS_FOLDER = exports.TMP_FOLDER = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const crypto_1 = __importDefault(require("crypto"));
const TMP_FOLDER = path_1.default.resolve(__dirname, '..', '..', 'tmp');
exports.TMP_FOLDER = TMP_FOLDER;
const UPLOADS_FOLDER = path_1.default.resolve(TMP_FOLDER, 'uploads');
exports.UPLOADS_FOLDER = UPLOADS_FOLDER;
const MULTER = {
    storage: multer_1.default.diskStorage({
        destination: TMP_FOLDER,
        filename(request, file, callback) {
            const fileHash = crypto_1.default.randomBytes(10).toString('hex');
            const fileName = `${fileHash}-${file.originalname}`;
            return callback(null, fileName);
        },
    }),
};
exports.MULTER = MULTER;

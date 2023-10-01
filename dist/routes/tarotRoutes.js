"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tarotController_1 = require("../controllers/tarotController");
const router = express_1.default.Router();
router.get('/draw-tarot-cards/:numberOfCards', tarotController_1.drawTarotCards);
exports.default = router;

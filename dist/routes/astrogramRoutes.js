"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const astrogramController_1 = require("../controllers/astrogramController");
const router = express_1.default.Router();
router.post('/get-planetary-positions', astrogramController_1.getPlanetaryPositions);
router.get('/user/planetary-positions', astrogramController_1.getUserPlanetaryPositions);
exports.default = router;

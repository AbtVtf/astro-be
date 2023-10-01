"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const tarotRoutes_1 = __importDefault(require("./routes/tarotRoutes"));
const affirmationRoutes_1 = __importDefault(require("./routes/affirmationRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const userAuth_1 = __importDefault(require("./userAuth"));
const app = (0, express_1.default)();
const port = 3000;
dotenv_1.default.config();
app.use(express_1.default.json());
app.use('/api', userRoutes_1.default);
app.use('/api', userAuth_1.default, tarotRoutes_1.default);
app.use('/api', userAuth_1.default, affirmationRoutes_1.default);
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});

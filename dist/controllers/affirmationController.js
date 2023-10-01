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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDailyAffirmation = void 0;
const openai_1 = __importDefault(require("openai"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("../db"));
dotenv_1.default.config();
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY,
});
function getDailyAffirmation(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const affirmationText = yield callGPTAPIForAffirmation();
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.user_id;
            console.log({ userId });
            db_1.default.query('INSERT INTO affirmations (user_id, affirmation_text) VALUES (?, ?)', [userId, affirmationText], (error) => {
                if (error)
                    throw error;
            });
            res.json({ affirmation: affirmationText });
        }
        catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    });
}
exports.getDailyAffirmation = getDailyAffirmation;
function callGPTAPIForAffirmation() {
    return __awaiter(this, void 0, void 0, function* () {
        const prompt = `Please provide a positive and empowering daily affirmation. Do not self identify, do no explain yourself,
   do not apologize, just provide a very powerfull and personal quote to empower a woman.`;
        const response = yield openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are a source of positive and empowering affirmations.",
                },
                { role: "user", content: prompt },
            ],
        });
        return response.choices[0].message.content;
    });
}

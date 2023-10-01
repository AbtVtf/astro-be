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
exports.drawTarotCards = void 0;
const openai_1 = __importDefault(require("openai"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("../db"));
dotenv_1.default.config();
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY,
});
function drawTarotCards(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const numberOfCards = Number(req.params.numberOfCards) || 2;
            const predictions = yield callGPTAPI(numberOfCards);
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.user_id;
            predictions.forEach(prediction => {
                db_1.default.query('INSERT INTO tarot_readings (user_id, card_name, card_interpretation) VALUES (?, ?, ?)', [userId, prediction.card, prediction.prediction], (error) => {
                    if (error)
                        throw error;
                });
            });
            res.json(predictions);
        }
        catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    });
}
exports.drawTarotCards = drawTarotCards;
function callGPTAPI(numberOfCards) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const prompt = `Please draw ${numberOfCards} totally random tarot cards from a deck and tell me their names separated by a comma.
  Do not self identify, do not explain to me what you are doing and do not add any other text to the response besides the requested cards separated by commas`;
        try {
            const response = yield openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "You are a knowledgeable and mystical Tarot card reader.",
                    },
                    { role: "user", content: prompt },
                ],
            });
            const content = (_b = (_a = response === null || response === void 0 ? void 0 : response.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content;
            if (!content)
                throw new Error('Unexpected response from OpenAI API');
            const cards = content.split(",");
            const predictionsPromises = cards.map((card) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const promptCard = `Please give me a mystical clairvoyant prediction about this tarot card ${card}. 
        Try to make it as insightful as possibletouching multiple personal things while keeping a veil of mystery. 
        Do not self identify, do not explain to me what you are doing and do not add any other text to the response
         besides the requested prediction AND FORMAT EVERYTHING INTO A SINGLE PARAGRAPH PLEASE. No new lines or empty spaces, just a single long string `;
                    const responseCard = yield openai.chat.completions.create({
                        model: "gpt-3.5-turbo",
                        messages: [
                            {
                                role: "system",
                                content: "You are a knowledgeable and mystical Tarot card reader.",
                            },
                            { role: "user", content: promptCard },
                        ],
                    });
                    return {
                        card,
                        prediction: responseCard.choices[0].message.content,
                    };
                }
                catch (error) {
                    console.error(`Error processing card ${card}:`, error);
                    return {
                        card,
                        error: 'Error processing this card',
                    };
                }
            }));
            const resolvedPredictions = yield Promise.all(predictionsPromises);
            return resolvedPredictions;
        }
        catch (error) {
            console.error('Error in callGPTAPI:', error);
            throw error;
        }
    });
}

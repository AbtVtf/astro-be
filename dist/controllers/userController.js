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
const db_1 = __importDefault(require("../db"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class UserController {
    static register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, email, password } = req.body;
                const hashedPassword = yield bcrypt_1.default.hash(password, 10);
                db_1.default.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword], (error, results) => {
                    if (error)
                        throw error;
                    res.status(201).json({ userId: results === null || results === void 0 ? void 0 : results.insertId });
                });
            }
            catch (error) {
                console.error(error);
                res.status(500).send('Internal Server Error');
            }
        });
    }
    static login(req, res) {
        try {
            const { username, password } = req.body;
            db_1.default.query('SELECT * FROM users WHERE username = ?', [username], (error, results) => __awaiter(this, void 0, void 0, function* () {
                if (error)
                    throw error;
                if (results.length === 0)
                    return res.status(401).send('Unauthorized');
                const user = results[0];
                const passwordMatch = yield bcrypt_1.default.compare(password, user.password);
                if (!passwordMatch)
                    return res.status(401).send('Unauthorized');
                const token = jsonwebtoken_1.default.sign({ userId: user.user_id }, process.env.JWT_SECRET || '');
                res.json({ token });
            }));
        }
        catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    }
}
exports.default = UserController;

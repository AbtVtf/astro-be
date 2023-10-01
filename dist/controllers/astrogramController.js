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
exports.getUserPlanetaryPositions = exports.getPlanetaryPositions = void 0;
const axios_1 = __importDefault(require("axios"));
const form_data_1 = __importDefault(require("form-data"));
const db_1 = __importDefault(require("../db"));
const openai_1 = __importDefault(require("openai"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY,
});
function getPlanetaryPositions(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { full_name, place, gender, day, month, year, hour, min, sec, lon, lat, tzone, } = req.body;
            let data = new form_data_1.default();
            data.append('api_key', "018b59ce1fd616d874afad0f44ba338d");
            data.append('full_name', full_name);
            data.append('place', place);
            data.append('gender', gender);
            data.append('day', day);
            data.append('month', month);
            data.append('year', year);
            data.append('hour', hour);
            data.append('min', min);
            data.append('sec', sec);
            data.append('lon', lon);
            data.append('lat', lat);
            data.append('tzone', tzone);
            const config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'https://astroapi-4.divineapi.com/western-api/v1/planetary-positions',
                headers: Object.assign({ Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2FzdHJvYXBpLTEuZGl2aW5lYXBpLmNvbS9hcGkvYXV0aC1hcGktdXNlciIsImlhdCI6MTY5NjE0OTg3MCwibmJmIjoxNjk2MTQ5ODcwLCJqdGkiOiJONEFaelg1QlZUYU13VGZpIiwic3ViIjoiMTI4MyIsInBydiI6ImU2ZTY0YmIwYjYxMjZkNzNjNmI5N2FmYzNiNDY0ZDk4NWY0NmM5ZDcifQ.TwW4edhdS8-Nnl1eawXtgt1kw6EqYJ4w1YzwU2oHqyo' }, data.getHeaders()),
                data: data,
            };
            const response = yield axios_1.default.request(config);
            if (!response.data.data || !Array.isArray(response.data.data)) {
                console.error('Unexpected response format from API', response.data);
                res.status(500).send('Internal Server Error due to unexpected response format from API');
                return;
            }
            const cleanedData = response.data.data
                .filter((item) => item && item.name !== "MC" && item.name !== "Ascendant")
                .map((item) => ({
                name: item.name,
                sign: item.sign,
                sign_no: item.sign_no,
                house: item.house,
            }));
            const userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.user_id;
            for (const position of cleanedData) {
                const [planetResults] = yield db_1.default.promise().execute('SELECT * FROM planets WHERE name = ?', [position.name]);
                console.log('Planet Results:', planetResults);
                if (!planetResults || planetResults.length === 0) {
                    console.error(`Planet ${position.name} not found in the database`);
                    continue;
                }
                const planetId = planetResults[0].planet_id;
                const [houseResults] = yield db_1.default.promise().execute('SELECT * FROM houses WHERE name = ?', [position.house]);
                console.log('House Results:', houseResults);
                if (!houseResults || houseResults.length === 0) {
                    console.error(`House ${position.house} not found in the database`);
                    continue;
                }
                const houseId = houseResults[0].house_id;
                const interpretation = yield callGPTAPIForInterpretation(position.name, position.house, position.sign);
                yield db_1.default.promise().execute('INSERT INTO planetary_positions(user_id, planet_id, sign_no, house_id, interpretation) VALUES(?, ?, ?, ?, ?)', [userId, planetId, position.sign_no, houseId, interpretation]);
            }
            res.json(cleanedData);
        }
        catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    });
}
exports.getPlanetaryPositions = getPlanetaryPositions;
function getUserPlanetaryPositions(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.user_id;
            if (!userId) {
                res.status(400).send('User ID is required.');
                return;
            }
            const [results] = yield db_1.default.promise().execute(`
      SELECT 
        pp.user_id,
        p.name AS planet_name,
        z.name AS zodiac_name,
        h.name AS house_name,
        pp.sign_no
      FROM 
        planetary_positions AS pp
      JOIN planets AS p ON pp.planet_id = p.planet_id
      JOIN houses AS h ON pp.house_id = h.house_id
      LEFT JOIN zodiacs AS z ON pp.sign_no = z.zodiac_id
      WHERE 
        pp.user_id = ?
      `, [userId]);
            if (!results || results.length === 0) {
                res.status(404).send('No planetary positions found for the user.');
                return;
            }
            res.json(results);
            for (const planetData in results) {
                console.log(results[planetData]);
            }
        }
        catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    });
}
exports.getUserPlanetaryPositions = getUserPlanetaryPositions;
function callGPTAPIForInterpretation(planet, house, sign) {
    return __awaiter(this, void 0, void 0, function* () {
        const prompt = `I need an interpretation for someone having ${planet} in house ${house} under the sign ${sign}. Keep it
  insightfull and medium in size. Do not self identify, do not apologize, do not explain what i asked for, just the interpreattion formated
  in a line string with no new lines or paraghaphs`;
        const response = yield openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are a mystical fortune teller, with amazing skills at interpreting birth charts in a personal 1 to 1 way.",
                },
                { role: "user", content: prompt },
            ],
        });
        console.log(response.choices[0].message.content);
        return response.choices[0].message.content;
    });
}

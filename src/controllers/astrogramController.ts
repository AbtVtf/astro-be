import express, { Request, Response } from 'express';
import axios from 'axios';
import FormData from 'form-data';
import connection from '../db';
import { AuthenticatedRequest } from '../userAuth';
import OpenAIApi from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAIApi({
  apiKey: process.env.OPENAI_API_KEY as string,
});
export async function getPlanetaryPositions(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const {

      full_name,
      place,
      gender,
      day,
      month,
      year,
      hour,
      min,
      sec,
      lon,
      lat,
      tzone,
    } = req.body;

    let data = new FormData();
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
      headers: {
        Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2FzdHJvYXBpLTEuZGl2aW5lYXBpLmNvbS9hcGkvYXV0aC1hcGktdXNlciIsImlhdCI6MTY5NjE0OTg3MCwibmJmIjoxNjk2MTQ5ODcwLCJqdGkiOiJONEFaelg1QlZUYU13VGZpIiwic3ViIjoiMTI4MyIsInBydiI6ImU2ZTY0YmIwYjYxMjZkNzNjNmI5N2FmYzNiNDY0ZDk4NWY0NmM5ZDcifQ.TwW4edhdS8-Nnl1eawXtgt1kw6EqYJ4w1YzwU2oHqyo',
        ...data.getHeaders(),
      },
      data: data,
    };

    const response = await axios.request(config);

    if (!response.data.data || !Array.isArray(response.data.data)) {
      console.error('Unexpected response format from API', response.data);
      res.status(500).send('Internal Server Error due to unexpected response format from API');
      return;
    }

    const cleanedData = response.data.data
      .filter((item: any) => item && item.name !== "MC" && item.name !== "Ascendant")
      .map((item: any) => ({
        name: item.name,
        sign: item.sign,
        sign_no: item.sign_no,
        house: item.house,
      }));

    const userId = req?.user?.user_id;

    for (const position of cleanedData) {
      const [planetResults]: any = await connection.promise().execute('SELECT * FROM planets WHERE name = ?', [position.name]);
      console.log('Planet Results:', planetResults);

      if (!planetResults || planetResults.length === 0) {
        console.error(`Planet ${position.name} not found in the database`);
        continue;
      }

      const planetId = planetResults[0].planet_id;
      const [houseResults]: any = await connection.promise().execute('SELECT * FROM houses WHERE name = ?', [position.house]);
      console.log('House Results:', houseResults);

      if (!houseResults || houseResults.length === 0) {
        console.error(`House ${position.house} not found in the database`);
        continue;
      }

      const houseId = houseResults[0].house_id;
      const interpretation = await callGPTAPIForInterpretation(position.name, position.house, position.sign)
      await connection.promise().execute('INSERT INTO planetary_positions(user_id, planet_id, sign_no, house_id, interpretation) VALUES(?, ?, ?, ?, ?)', [userId, planetId, position.sign_no, houseId, interpretation]);
    }

    res.json(cleanedData);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}

export async function getUserPlanetaryPositions(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const userId = req?.user?.user_id;
    
    if (!userId) {
      res.status(400).send('User ID is required.');
      return;
    }

    const [results]: any = await connection.promise().execute(
      `
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
      `, 
      [userId]
    );

    if (!results || results.length === 0) {
      res.status(404).send('No planetary positions found for the user.');
      return;
    }

    res.json(results);
    for (const planetData in results){
      console.log(results[planetData])
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}

async function callGPTAPIForInterpretation(planet:string, house:string, sign:string ) {
  const prompt = `I need an interpretation for someone having ${planet} in house ${house} under the sign ${sign}. Keep it
  insightfull and medium in size. Do not self identify, do not apologize, do not explain what i asked for, just the interpreattion formated
  in a line string with no new lines or paraghaphs`;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are a mystical fortune teller, with amazing skills at interpreting birth charts in a personal 1 to 1 way.",
      },
      { role: "user", content: prompt },
    ],
  });

  console.log(response.choices[0].message.content)
  return response.choices[0].message.content;
}
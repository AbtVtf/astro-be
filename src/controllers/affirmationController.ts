import { Request, Response } from 'express';
import OpenAIApi from 'openai';
import dotenv from 'dotenv';
import connection from '../db';
import { AuthenticatedRequest } from '../userAuth';
dotenv.config();

const openai = new OpenAIApi({
  apiKey: process.env.OPENAI_API_KEY as string,
});

export async function getDailyAffirmation(req: AuthenticatedRequest, res: Response) {
  try {
    const affirmationText = await callGPTAPIForAffirmation();

    const userId = req.user?.user_id; 
    console.log({userId})
    connection.query(
      'INSERT INTO affirmations (user_id, affirmation_text) VALUES (?, ?)',
      [userId, affirmationText],
      (error) => {
        if (error) throw error;
      }
    );

    res.json({ affirmation: affirmationText });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}

async function callGPTAPIForAffirmation() {
  const prompt = `Please provide a positive and empowering daily affirmation. Do not self identify, do no explain yourself,
   do not apologize, just provide a very powerfull and personal quote to empower a woman.`;

  const response = await openai.chat.completions.create({
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
}

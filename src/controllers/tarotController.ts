import { Request, Response } from 'express';
import OpenAIApi from "openai";
import dotenv from 'dotenv';
import connection from '../db';
import { AuthenticatedRequest } from '../userAuth';

dotenv.config();

const openai = new OpenAIApi({
  apiKey: process.env.OPENAI_API_KEY as string,
});

export async function drawTarotCards(req: AuthenticatedRequest, res: Response) {
  try {
    const numberOfCards = Number(req.params.numberOfCards) || 2;
    const predictions = await callGPTAPI(numberOfCards);
    
    const userId = req.user?.user_id; 
    
    predictions.forEach(prediction => {
      connection.query(
        'INSERT INTO tarot_readings (user_id, card_name, card_interpretation) VALUES (?, ?, ?)',
        [userId, prediction.card, prediction.prediction],
        (error) => {
          if (error) throw error;
        }
      );
    });

    res.json(predictions);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}
async function callGPTAPI(numberOfCards: number) {
  const prompt = `Please draw ${numberOfCards} totally random tarot cards from a deck and tell me their names separated by a comma.
  Do not self identify, do not explain to me what you are doing and do not add any other text to the response besides the requested cards separated by commas`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a knowledgeable and mystical Tarot card reader.",
        },
        { role: "user", content: prompt },
      ],
    });

    const content = response?.choices[0]?.message?.content;
    if (!content) throw new Error('Unexpected response from OpenAI API');

    const cards = content.split(",");
    
    const predictionsPromises = cards.map(async (card) => {
      try {
        const promptCard = `Please give me a mystical clairvoyant prediction about this tarot card ${card}. 
        Try to make it as insightful as possibletouching multiple personal things while keeping a veil of mystery. 
        Do not self identify, do not explain to me what you are doing and do not add any other text to the response
         besides the requested prediction AND FORMAT EVERYTHING INTO A SINGLE PARAGRAPH PLEASE. No new lines or empty spaces, just a single long string `;
        const responseCard = await openai.chat.completions.create({
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
      } catch (error) {
        console.error(`Error processing card ${card}:`, error);
        return {
          card,
          error: 'Error processing this card',
        };
      }
    });

    const resolvedPredictions = await Promise.all(predictionsPromises);
    return resolvedPredictions;
  } catch (error) {
    console.error('Error in callGPTAPI:', error);
    throw error;
  }
}


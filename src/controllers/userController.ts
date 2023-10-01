import { Request, Response } from 'express';
import connection from '../db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

class UserController {
  static async register(req: Request, res: Response) {
    try {
      const { username, email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      
      connection.query(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [username, email, hashedPassword],
        (error, results:any) => {
          if (error) throw error;
          res.status(201).json({ userId: results?.insertId });
        }
      );
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  }

  static login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;
      
      connection.query(
        'SELECT * FROM users WHERE username = ?',
        [username],
        async (error, results:any) => {
          if (error) throw error;
          
          if (results.length === 0) return res.status(401).send('Unauthorized');
          
          const user = results[0];
          const passwordMatch = await bcrypt.compare(password, user.password);
          
          if (!passwordMatch) return res.status(401).send('Unauthorized');
          
          const token = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET || ''); 
          res.json({ token });
        }
      );
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  }
}

export default UserController;

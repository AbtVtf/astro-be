import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import connection from './db';
import { FieldPacket, RowDataPacket } from 'mysql2';

interface User {
  user_id: number;
}

export interface AuthenticatedRequest extends Request {
  user?: User;
}

const authenticateUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).send('No header in call');
    
    const token = authHeader.split(' ')[1];
    
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || '') as JwtPayload;
    } catch (err) {
      console.log(err)
      return res.status(401).send('Unauthorized');
    }
    
    const [users] = (await connection.promise().query('SELECT * FROM users WHERE user_id = ?', [decoded.userId])) as [RowDataPacket[], FieldPacket[]];
    if (users.length === 0) return res.status(401).send('User not found');
    
    req.user = users[0] as User;
    console.log('User in Middleware:', req.user);
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).send('Internal Server Error');
  }
};

export default authenticateUser;
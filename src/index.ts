import express from 'express';
import dotenv from 'dotenv';
import tarotRoutes from './routes/tarotRoutes';
import affirmationRoutes from "./routes/affirmationRoutes"
import userRoutes from "./routes/userRoutes"
import astrogramRoutes from "./routes/astrogramRoutes"
import authenticateUser from './userAuth';

const app = express();
const port = 3000;

dotenv.config();

app.use(express.json());

app.use('/api', userRoutes); 

app.use('/api', authenticateUser,astrogramRoutes); 
app.use('/api', authenticateUser, tarotRoutes); 
app.use('/api', authenticateUser, affirmationRoutes);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
});

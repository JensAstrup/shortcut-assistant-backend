import express, { Application } from 'express';
import { config } from 'dotenv';
config(); // Load environment variables from .env file
import apiRouter from './routes/api';

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', apiRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

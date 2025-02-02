import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import creditCardRoutes from './routes/creditCardRoute.js';

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/credit-card', creditCardRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

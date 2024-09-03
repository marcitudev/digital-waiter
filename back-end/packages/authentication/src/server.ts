import express, { Router } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// controllers
import userController from './controllers/user.controller';
import authenticationController from './controllers/authentication.controller';

// middlewares
import { verifyToken } from './controllers/authentication.controller';

dotenv.config();

const app = express();
const route = Router();
const PORT = 3001;

app.use(cors({
    credentials: true,
    origin: process.env.CORS_ORIGINS?.split(',')
}));
app.use(route);
app.use(express.json());
app.use(cookieParser());

app.use('/authentication', authenticationController);
app.use('/users', verifyToken, userController);

app.listen(PORT, () => {
    console.log(`---- Server is running on port ${PORT} ----`);
});


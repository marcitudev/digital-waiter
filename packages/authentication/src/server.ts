import express, { Router } from 'express';

// controllers
import userController from './controllers/user.controller';
import authenticationController from './controllers/authentication.controller';

// middlewares
import { verifyToken } from './controllers/authentication.controller';

const app = express();
const route = Router();
const PORT = 3001;

app.use(route);
app.use(express.json());

app.use('/authentication', authenticationController);
app.use('/users', verifyToken, userController);

app.listen(PORT, () => {
    console.log(`---- Server is running on port ${PORT} ----`);
});


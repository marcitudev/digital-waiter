import express, { Router } from 'express';

// controllers
import userController from './controllers/user.controller';

const app = express();
const route = Router();
const PORT = 3001;

app.use(route);
app.use('/users', userController);

app.listen(PORT, () => {
    console.log(`---- Server is running on port ${PORT} ----`);
});


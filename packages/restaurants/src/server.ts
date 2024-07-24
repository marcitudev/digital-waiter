import express, { Router } from 'express';

const app = express();
const route = Router();
const PORT = 3002;

app.use(route);
app.use(express.json());

app.listen(PORT, () => {
    console.log(`---- Server is running on port ${PORT} ----`);
});


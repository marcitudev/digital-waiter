import express from 'express';
import * as migrations from './migrations/execute-migrations';

const app = express();
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`---- Server is running on port ${PORT} ----`);
    migrations.execute();
});
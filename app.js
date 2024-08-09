import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
const app = express();
const APP_PORT = 5000;
app.use(cors({ origin: true }));

app.get('/', (req, res) => {
    res.json({"Hello": "World",
            "Version": 2})
})

app.get("/api/health", (req, res) => {
    res.json({"healthy:": true})
})

app.listen(APP_PORT, () => {
    console.log(`api listening at http://localhost:${APP_PORT}`)
})
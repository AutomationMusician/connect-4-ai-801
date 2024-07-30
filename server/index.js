import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import bodyParser from 'body-parser';

import { GameBoard } from '../common/game.mjs';
import { minimax, heuristic } from './minimax.js';
// Define __dirname using ES module syntax
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(bodyParser.json());
// CORS option setup
const corsOptions = {
    origin: '*', 
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization'
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight requests

const port = process.env.PORT || 3000;

// Redirect root to '/client' route
app.get('/', (req, res) => res.redirect('/client'));

app.use('/client', express.static(path.join(__dirname, '../client')));
app.use('/common', express.static(path.join(__dirname, '../common')));

app.get('/api/next-move/:xoformat', (req, res) => {
    const gameBoard = new GameBoard(req.params.xoformat);
    console.log(`${req.params.xoformat}; heuristic: ${heuristic(gameBoard, 'X')}`);
    const bestCol = minimax(gameBoard); 
    console.log(`Received game state ${req.params.xoformat}. The AI chooses to move in column index ${bestCol}`);
    res.send(String(bestCol)); // Send column as a response. Use setTimeout to simulate it taking a full second.
});

app.listen(port, () => console.log(`Listening on port ${port}`));

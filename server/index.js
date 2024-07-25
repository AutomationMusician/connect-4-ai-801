import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import bodyParser from 'body-parser';
//const session = require('express-session');

import { GameBoard } from '../common/game.mjs';
import { minimax } from './minimax.js';
const MAX_DEPTH = 10; // Set a reasonable max depth
const MIN_DEPTH = 3;  // Set a minimum depth to avoid too shallow searches
// Define __dirname using ES module syntax
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(bodyParser.json());
/*app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
})); */
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
    const game = new GameBoard(req.params.xoformat);
    const board = game.board;
    const emptySlots = board.flat().filter(cell => cell === ' ').length;
    const depth = Math.min(MAX_DEPTH, Math.max(MIN_DEPTH, Math.floor(emptySlots / 2)));

    const [bestCol] = minimax(board, depth, -Infinity, Infinity, true); // Adjust depth as needed
    console.log(`Received game state ${req.params.xoformat}. The AI chooses to move in column index ${bestCol}`);
    setTimeout(() => res.send(String(bestCol)), 1000); // Send column as a response. Use setTimeout to simulate it taking a full second.
});

app.listen(port, () => console.log(`Listening on port ${port}`));

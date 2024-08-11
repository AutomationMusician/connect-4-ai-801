import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GameBoard } from 'common/game';
import { minimax } from './minimax.js';
import { heuristic } from './heuristic.js';

const port = process.env.PORT || 3000;
const basePath = process.env.BASE_PATH || "";
console.log(basePath);
const app = express();

// Define __dirname using ES module syntax
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Redirect root to '/client' route
app.get(basePath, (req, res) => res.redirect(basePath + '/client'));
app.get(basePath + '/', (req, res) => res.redirect(basePath + '/client'));

app.use(basePath + '/client', express.static(path.join(__dirname, '../client')));
app.use(basePath + '/common', express.static(path.join(__dirname, '../common')));

app.get(basePath + '/api/next-move/:model/:xoformat', (req, res) => {
    const model = req.params.model;
    const xoformat = req.params.xoformat;
    const gameBoard = new GameBoard(xoformat);
    if (gameBoard.status() !== 'U') {
        const message = "Game is complete. No move can be made: " + xoformat;
        console.error(message);
        res.status(400).send(message);
        return;
    }
    let bestCol;
    switch (model) {
        case "random":
            const availableCols = gameBoard.availableColumns()
            bestCol = availableCols[Math.floor(Math.random() * availableCols.length)];
            break;
        case "minimax":
            // evaluate minimax with no heuristic (heuristic function = 0)
            bestCol = minimax(gameBoard, (gameBoard, nextPlayer) => 0);
            break;
        case "minimax-with-heuristic":
            // evaluate minimax with heuristic
            bestCol = minimax(gameBoard, heuristic); 
            break;
        default:
            const message = `Model '${model}' not found`;
            console.error(message);
            res.status(400).send(message);
            return;
    }
    console.log(`AI chooses to move in column index ${bestCol} using the model '${model}' for the received game state: ${xoformat}. `);
    res.status(200).send(String(bestCol)); // send column as a response
});

app.listen(port, () => console.log(`Listening on port ${port}`));

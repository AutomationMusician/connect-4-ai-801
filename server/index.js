import express from 'express';
import * as path from 'path';
const __dirname = import.meta.dirname; // need to define __dirname because we are using ES Modules rather than CommonJS
import { GameBoard, numWide }  from 'common/game';

const app = express();

const port = process.env.PORT || 3000;

// redirect root to '/client' route
app.get('/', (req, res) => res.redirect('/client'));

app.use('/client', express.static(path.join(__dirname, '../client')));

app.use('/common', express.static(path.join(__dirname, '../common')));

app.get('/api/next-move/:xoformat', (req, res) => {
    const game = new GameBoard(req.params.xoformat);
    const randomColumn = Math.floor(Math.random() * numWide); // return random number 0-6. TODO: make this use a real algorithm.
    console.log(`Received game state ${req.params.xoformat}. The AI choses to move in column index ${randomColumn}`);
    setTimeout(() => res.send(String(randomColumn)), 1000); // send column as a response. Use setTimeout to simulate it taking a full second.
});

app.listen(port, () => console.log(`Listening on port ${port}`));

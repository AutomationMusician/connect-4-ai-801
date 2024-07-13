import express from 'express';
import * as path from 'path';
const __dirname = import.meta.dirname;
import { GameBoard, numWide, numHigh, emptyBoardXOFormat }  from 'common/game';
console.log({ GameBoard, numWide, numHigh, emptyBoardXOFormat });

const app = express();

const port = process.env.PORT || 3000;

// redirect root to '/client' route
app.get('/', (req, res) => res.redirect('/client'));

app.use('/client', express.static(path.join(__dirname, '../client')));

app.use('/common', express.static(path.join(__dirname, '../common')));

app.get('/api/next-move/:xoformat', (req, res) => {
    const game = new GameBoard(req.params.xoformat);
    console.log(game.toXOFormat());
});

app.listen(port, () => console.log(`Listening on port ${port}`));

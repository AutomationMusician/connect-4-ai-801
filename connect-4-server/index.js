const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const Connect4 = require('./minimax');
const AlphaBetaAI = require('./alphaBetaAI');
const MCTS = require('./mctsAI');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '../connect-4-client')));

const game = new Connect4();
const alphaBetaAI = new AlphaBetaAI();
const mctsAI = new MCTS();

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('move', (data) => {
        const { column, aiType } = data;

        game.dropDisc(column);
        let aiMove;
        if (aiType === 'alphabeta') {
            aiMove = alphaBetaAI.getBestMove(game.board, 4, -Infinity, Infinity, true);
        } else if (aiType === 'mcts') {
            aiMove = mctsAI.getBestMove(game.board, 1000);
        }

        game.dropDisc(aiMove);
        io.emit('move', { board: game.board, aiMove });
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

server.listen(port, () => console.log(`Listening on port ${port}`));

import { GameBoard } from 'common/game';
import { heuristic } from './minimax.js';
import { response } from 'express';

const xoformat='XOXOOX.OOXOXO.XOX.OXOXXO.OOOXXX.OXO.XXXOXO.';
const difficulty = 'pro';
const gameBoard = new GameBoard(xoformat);
fetch(`https://tleemann.de/php/four.php?move=${xoformat}&level=${difficulty}`).then(response => {
    response.text().then(output => {
        console.log(output);
    })
})
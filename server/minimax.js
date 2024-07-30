import { GameBoard, numHigh, numWide, lineSize } from '../common/game.mjs';

const MAX_DEPTH = 6;

/**
 * Implements the minimax algorithm with alpha-beta pruning to determine the best move.
 * See "Artificial Intelligence - A Modern Approach (3rd Edition)" page 170.
 *
 * @param {GameBoard} gameBoard - The current state of the Connect4 game board.
 * @returns {integer} - The best column to play
 */
export function minimax(gameBoard) {
    const availableColumns = gameBoard.availableColumns();
    let bestValue = -Infinity;
    let bestCols;
    availableColumns.forEach(col => {
        gameBoard.place(col, 'X'); // update board
        const value = minimaxRecursive(gameBoard, 0, -Infinity, Infinity, 'O');
        if (value > bestValue) {
            bestValue = value;
            bestCols = [col];
        } 
        else if (value === bestValue) {
            bestCols.push(col);
        }
        gameBoard.remove(col); // undo board update
    });
    return bestCols[Math.floor(Math.random() * bestCols.length)]; // return random value from the best column
}

/**
 * Implements the minimax algorithm with alpha-beta pruning to determine the best move.
 * 'X' (the AI) is the maximizing player and 'O' the opponent is the minimizing player
 *
 * @param {GameBoard} gameBoard - The current state of the Connect4 game board.
 * @param {number} depth - The maximum depth of the search tree.
 * @param {number} alpha - The alpha value for alpha-beta pruning.
 * @param {number} beta - The beta value for alpha-beta pruning.
 * @param {character} player - character representation of the player.
 * @returns {number} - score
 */
function minimaxRecursive(gameBoard, depth, alpha, beta, player) {
    const status = gameBoard.status();

    // check if there is a winner or it is a tie
    if (status !== 'U')
    {
        let value = 0; // default to tie
        if (status === 'O') {
            value = -1; 
        }
        else if (status === 'X') {
            value = 1;
        }
        // make the value more extreme (a bigger win/loss) if it is shallower in the search tree 
        // and less extreme (a smaller win/loss) if it is deeper in the search tree
        return value * (MAX_DEPTH - depth + 1);
    }

    // check if we've reached the maximum depth
    if (depth === MAX_DEPTH) {
        const nextPlayer = player === 'X' ? 'O' : 'X';
        const score = heuristic(gameBoard, nextPlayer);
        return score;
    }

    const availableCols = gameBoard.availableColumns();
    if (player === 'X') {
        // maximizing player
        let value = -Infinity;
        for (let col of availableCols) {
            gameBoard.place(col, 'X'); // update board
            const newScore = minimaxRecursive(gameBoard, depth + 1, alpha, beta, 'O');
            gameBoard.remove(col); // undo update
            if (newScore > value) {
                value = newScore;
            }
            if (value >= beta) {
                return value;
            }
            if (value > alpha) {
                alpha = value;
            }
        }
        return value;
    } else {
        let value = Infinity;
        for (let col of availableCols) {
            gameBoard.place(col, 'O'); // update board
            const newScore = minimaxRecursive(gameBoard, depth + 1, alpha, beta, 'X');
            gameBoard.remove(col); // undo update
            if (newScore < value) {
                value = newScore;
            }
            if (value <= alpha) {
                return value;
            }
            if (value < beta) {
                beta = value;
            }
        }
        return value;
    }
}

/**
 * Evaluate the GameBoard with a heuristic
 * @param {GameBoard} gameBoard 
 * @param {character} nextPlayer 
 * @returns {number} score of GameBoard based on the heuristic
 */
export function heuristic(gameBoard, nextPlayer) {
    const totalHits = {
        'X': 0,
        'O': 0,
        ' ': 0
    };
    for (let rowIndex=0; rowIndex<gameBoard.board.length; rowIndex++) {
        const row = gameBoard.board[rowIndex];
        for (let colIndex=0; colIndex<row.length; colIndex++) {
            const player = row[colIndex];
            totalHits[player] += numHits(rowIndex, colIndex);
        }
    }
    let nextMoveMaxNumHits = 0;
    for (let col=0; col<numWide; col++) {
        const row = gameBoard.nextAvailableRow(col);
        if (row === -1)
            continue;
        const hits = numHits(row, col);
        if (hits > nextMoveMaxNumHits) {
            nextMoveMaxNumHits = hits;
        }
    }
    totalHits[nextPlayer] += nextMoveMaxNumHits;
    return (totalHits['X'] - totalHits['O'])/(totalHits['X'] + totalHits['O'])
}

/**
 * Calculate the number of lines that a cell at row,col can be in
 * @param {integer} row 
 * @param {integer} col 
 * @returns {integer} the number of lines that the cell at row,col can be in
 */
function numHits(row, col) {
    const distanceFromTopBottom = row < numHigh - row - 1 ? row : numHigh - row - 1;
    const distanceFromLeftRight = col < numWide - col - 1 ? col : numWide - col - 1;
    const numHorizontalLines = distanceFromLeftRight+1
    const numVerticalLines = distanceFromTopBottom+1
    const numDiagonalUpRight = distanceFromTopBottom < distanceFromLeftRight ? distanceFromTopBottom + 1 : distanceFromLeftRight + 1;
    const numDiagonalUpLeftLinesNoConstraints = distanceFromTopBottom + distanceFromLeftRight - lineSize + 2;
    const numDiagonalUpLeftLinesMaxSize = numDiagonalUpLeftLinesNoConstraints > lineSize ? lineSize : numDiagonalUpLeftLinesNoConstraints;
    const numDiagonalUpLeftLinesMinZero = numDiagonalUpLeftLinesMaxSize < 0 ? 0 : numDiagonalUpLeftLinesMaxSize;
    return numHorizontalLines + numVerticalLines + numDiagonalUpRight + numDiagonalUpLeftLinesMinZero;
}

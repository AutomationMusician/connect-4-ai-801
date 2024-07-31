import { GameBoard } from 'common/game';

const MAX_DEPTH = 7;

/**
 * Implements the minimax algorithm with alpha-beta pruning to determine the best move.
 * See "Artificial Intelligence - A Modern Approach (3rd Edition)" page 170.
 *
 * @param {GameBoard} gameBoard - The current state of the Connect4 game board.
 * @param {(gameBoard: GameBoard, nextPlayer: character) => number} heuristicFunction heuristic function
 * @returns {integer} - The best column to play
 */
export function minimax(gameBoard, heuristicFunction) {
    const availableColumns = gameBoard.availableColumns();
    let bestValue = -Infinity;
    let bestCols;
    availableColumns.forEach(col => {
        gameBoard.place(col, 'X'); // update board
        const value = minimaxRecursive(gameBoard, 0, -Infinity, Infinity, 'O', heuristicFunction);
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
 * @param {(gameBoard: GameBoard, nextPlayer: character) => number} heuristicFunction heuristic function
 * @returns {number} - score
 */
function minimaxRecursive(gameBoard, depth, alpha, beta, player, heuristicFunction) {
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
        return heuristicFunction(gameBoard, nextPlayer);
    }

    const availableCols = gameBoard.availableColumns();
    if (player === 'X') {
        // maximizing player
        let value = -Infinity;
        for (let col of availableCols) {
            gameBoard.place(col, 'X'); // update board
            const newScore = minimaxRecursive(gameBoard, depth + 1, alpha, beta, 'O', heuristicFunction);
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
            const newScore = minimaxRecursive(gameBoard, depth + 1, alpha, beta, 'X', heuristicFunction);
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

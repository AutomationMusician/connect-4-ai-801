import { numWide, numHigh } from '../common/game.mjs';

const EMPTY = ' ';
const PLAYER = 'X';
const AI = 'O';

/**
 * Checks if the topmost cell in the specified column is empty, indicating
 * that a move can be made in that column.
 *
 * @param {Array<Array<string>>} board - The current state of the Connect Four game board.
 * @param {number} col - The column index to check for a valid move.
 * @returns {boolean} - Returns true if a move can be made in the specified column, otherwise false.
 */
function isValidLocation(board, col) {
    return board[numHigh - 1][col] === EMPTY;
}

/**
 * Finds the next available row in the specified column where a piece can be dropped.
 *
 * @param {Array<Array<string>>} board - The current state of the Connect Four game board.
 * @param {number} col - The column index to check for the next open row.
 * @returns {number|null} - Returns the row index of the next available spot or null if the column is full.
 */
function getNextOpenRow(board, col) {
    for (let r = numHigh - 1; r >= 0; r--) {
        if (board[r][col] === EMPTY) {
            return r;
        }
    }
    return null;
}

/**
 * Drops a piece in the specified location on the board.
 *
 * @param {Array<Array<string>>} board - The current state of the Connect Four game board.
 * @param {number} row - The row index where the piece will be dropped.
 * @param {number} col - The column index where the piece will be dropped.
 * @param {string} piece - The piece to drop ('X' for player, 'O' for AI).
 */
function dropPiece(board, row, col, piece) {
    board[row][col] = piece;
}

/**
 * Checks if the specified piece has a winning move on the board.
 *
 * @param {Array<Array<string>>} board - The current state of the Connect Four game board.
 * @param {string} piece - The piece to check for a win ('X' for player, 'O' for AI).
 * @returns {boolean} - Returns true if the specified piece has a winning move, otherwise false.
 */
function winningMove(board, piece) {
    // Check horizontal locations for a win
    for (let c = 0; c < numWide - 3; c++) {
        for (let r = 0; r < numHigh; r++) {
            if (board[r][c] === piece && board[r][c + 1] === piece && board[r][c + 2] === piece && board[r][c + 3] === piece) {
                return true;
            }
        }
    }

    // Check vertical locations for a win
    for (let c = 0; c < numWide; c++) {
        for (let r = 0; r < numHigh - 3; r++) {
            if (board[r][c] === piece && board[r + 1][c] === piece && board[r + 2][c] === piece && board[r + 3][c] === piece) {
                return true;
            }
        }
    }

    // Check positively sloped diagonals for a win
    for (let c = 0; c < numWide - 3; c++) {
        for (let r = 0; r < numHigh - 3; r++) {
            if (board[r][c] === piece && board[r + 1][c + 1] === piece && board[r + 2][c + 2] === piece && board[r + 3][c + 3] === piece) {
                return true;
            }
        }
    }

    // Check negatively sloped diagonals for a win
    for (let c = 0; c < numWide - 3; c++) {
        for (let r = 3; r < numHigh; r++) {
            if (board[r][c] === piece && board[r - 1][c + 1] === piece && board[r - 2][c + 2] === piece && board[r - 3][c + 3] === piece) {
                return true;
            }
        }
    }

    return false;
}

/**
 * Evaluates the board position and returns a score based on the strategic advantage
 * for the specified piece.
 *
 * @param {Array<Array<string>>} board - The current state of the Connect Four game board.
 * @param {string} piece - The piece to evaluate the score for ('X' for player, 'O' for AI).
 * @returns {number} - The evaluated score of the board position.
 */
function scorePosition(board, piece) {
    let score = 0;

    // Score center column
    const centerArray = [];
    for (let r = 0; r < numHigh; r++) {
        centerArray.push(board[r][Math.floor(numWide / 2)]);
    }
    const centerCount = centerArray.filter(cell => cell === piece).length;
    score += centerCount * 3;

    // Score horizontal
    for (let r = 0; r < numHigh; r++) {
        const rowArray = board[r];
        for (let c = 0; c < numWide - 3; c++) {
            const window = rowArray.slice(c, c + 4);
            score += evaluateWindow(window, piece);
        }
    }

    // Score vertical
    for (let c = 0; c < numWide; c++) {
        const colArray = [];
        for (let r = 0; r < numHigh; r++) {
            colArray.push(board[r][c]);
        }
        for (let r = 0; r < numHigh - 3; r++) {
            const window = colArray.slice(r, r + 4);
            score += evaluateWindow(window, piece);
        }
    }

    // Score positive sloped diagonal
    for (let r = 0; r < numHigh - 3; r++) {
        for (let c = 0; c < numWide - 3; c++) {
            const window = [board[r][c], board[r + 1][c + 1], board[r + 2][c + 2], board[r + 3][c + 3]];
            score += evaluateWindow(window, piece);
        }
    }

    // Score negative sloped diagonal
    for (let r = 0; r < numHigh - 3; r++) {
        for (let c = 0; c < numWide - 3; c++) {
            const window = [board[r + 3][c], board[r + 2][c + 1], board[r + 1][c + 2], board[r][c + 3]];
            score += evaluateWindow(window, piece);
        }
    }

    return score;
}

/**
 * Evaluates a 4-cell window and assigns a score based on the number of pieces and empty cells.
 *
 * @param {Array<string>} window - A 4-cell array representing a segment of the board.
 * @param {string} piece - The piece to evaluate the score for ('X' for player, 'O' for AI).
 * @returns {number} - The score for the window based on the specified piece.
 */
function evaluateWindow(window, piece) {
    const oppPiece = piece === PLAYER ? AI : PLAYER;
    let score = 0;

    if (window.filter(cell => cell === piece).length === 4) {
        score += 100;
    } else if (window.filter(cell => cell === piece).length === 3 && window.filter(cell => cell === EMPTY).length === 1) {
        score += 5;
    } else if (window.filter(cell => cell === piece).length === 2 && window.filter(cell => cell === EMPTY).length === 2) {
        score += 2;
    }

    if (window.filter(cell => cell === oppPiece).length === 3 && window.filter(cell => cell === EMPTY).length === 1) {
        score -= 4;
    }

    return score;
}

/**
 * Determines if the game has reached a terminal state (win or draw).
 *
 * @param {Array<Array<string>>} board - The current state of the Connect Four game board.
 * @returns {boolean} - Returns true if the game is in a terminal state, otherwise false.
 */
function isTerminalNode(board) {
    return winningMove(board, PLAYER) || winningMove(board, AI) || getValidLocations(board).length === 0;
}

/**
 * Gets all the valid column indices where a move can be made.
 *
 * @param {Array<Array<string>>} board - The current state of the Connect Four game board.
 * @returns {Array<number>} - An array of valid column indices.
 */
function getValidLocations(board) {
    const validLocations = [];
    for (let col = 0; col < numWide; col++) {
        if (isValidLocation(board, col)) {
            validLocations.push(col);
        }
    }
    return validLocations;
}

/**
 * Prioritizes columns based on strategic evaluation for making the next move.
 *
 * @param {Array<Array<string>>} board - The current state of the Connect Four game board.
 * @param {string} piece - The piece to evaluate the columns for ('X' for player, 'O' for AI).
 * @returns {Array<number>} - An array of column indices sorted by priority.
 */
function prioritizeColumns(board, piece) {
    const validLocations = getValidLocations(board);
    const center = Math.floor(numWide / 2);

    // Calculate scores for each column
    const columnScores = validLocations.map(col => {
        const row = getNextOpenRow(board, col);
        if (row !== null) {
            const tempBoard = board.map(row => row.slice());
            dropPiece(tempBoard, row, col, piece);
            if (winningMove(tempBoard, piece)) {
                return { col, score: 100000 }; // Immediate winning move
            } else {
                const oppPiece = piece === PLAYER ? AI : PLAYER;
                if (winningMove(tempBoard, oppPiece)) {
                    return { col, score: 50000 }; // Block opponent's winning move
                }
                const score = scorePosition(tempBoard, piece);
                return { col, score };
            }
        }
        return { col, score: -Infinity };
    });

    // Sort columns by score, then by proximity to center
    columnScores.sort((a, b) => {
        if (b.score !== a.score) {
            return b.score - a.score;
        } else {
            return Math.abs(center - a.col) - Math.abs(center - b.col);
        }
    });

    return columnScores.map(item => item.col);
}

/**
 * Implements the minimax algorithm with alpha-beta pruning to determine the best move.
 *
 * @param {Array<Array<string>>} board - The current state of the Connect4 game board.
 * @param {number} depth - The maximum depth of the search tree.
 * @param {number} alpha - The alpha value for alpha-beta pruning.
 * @param {number} beta - The beta value for alpha-beta pruning.
 * @param {boolean} maximizingPlayer - A flag indicating whether the current player is the maximizing player (AI).
 * @returns {[number|null, number]} - The best column to play and its evaluated score.
 */
function minimax(board, depth, alpha, beta, maximizingPlayer) {
    const validLocations = getValidLocations(board);
    const isTerminal = isTerminalNode(board);

    if (depth === 0 || isTerminal) {
        if (isTerminal) {
            if (winningMove(board, AI)) {
                return [null, 100000000000000];
            } else if (winningMove(board, PLAYER)) {
                return [null, -10000000000000];
            } else {
                return [null, 0];
            }
        } else {
            return [null, scorePosition(board, AI)];
        }
    }

    if (maximizingPlayer) {
        let value = -Infinity;
        let bestCols = [];
        for (let col of validLocations) {
            const row = getNextOpenRow(board, col);
            if (row !== null) {
                const bCopy = board.map(row => row.slice());
                dropPiece(bCopy, row, col, AI);
                const newScore = minimax(bCopy, depth - 1, alpha, beta, false)[1];
                if (newScore > value) {
                    value = newScore;
                    bestCols = [col];
                } else if (newScore === value) {
                    bestCols.push(col);
                }
                alpha = Math.max(alpha, value);
                if (alpha >= beta) {
                    break;
                }
            }
        }
        const bestCol = bestCols[Math.floor(Math.random() * bestCols.length)];
        return [bestCol, value];
    } else {
        let value = Infinity;
        let bestCols = [];
        for (let col of validLocations) {
            const row = getNextOpenRow(board, col);
            if (row !== null) {
                const bCopy = board.map(row => row.slice());
                dropPiece(bCopy, row, col, PLAYER);
                const newScore = minimax(bCopy, depth - 1, alpha, beta, true)[1];
                if (newScore < value) {
                    value = newScore;
                    bestCols = [col];
                } else if (newScore === value) {
                    bestCols.push(col);
                }
                beta = Math.min(beta, value);
                if (alpha >= beta) {
                    break;
                }
            }
        }
        const bestCol = bestCols[Math.floor(Math.random() * bestCols.length)];
        return [bestCol, value];
    }
}

export { minimax, isValidLocation, getNextOpenRow, dropPiece, winningMove, isTerminalNode, getValidLocations };

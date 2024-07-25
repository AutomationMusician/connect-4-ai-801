import { numWide, numHigh } from '../common/game.mjs';

const EMPTY = ' ';
const PLAYER = 'X';
const AI = 'O';
const DEPTH = numHigh;

function isValidLocation(board, col) {
    return board[numHigh-1][col] === EMPTY;
}

function getNextOpenRow(board, col) {
    for (let r = numHigh - 1; r >= 0; r--) {
        if (board[r][col] === EMPTY) {
            return r;
        }
    }
    return null;
}

function dropPiece(board, row, col, piece) {
    board[row][col] = piece;
}

function winningMove(board, piece) {
    for (let c = 0; c < numWide - 3; c++) {
        for (let r = 0; r < numHigh; r++) {
            if (board[r][c] === piece && board[r][c + 1] === piece && board[r][c + 2] === piece && board[r][c + 3] === piece) {
                return true;
            }
        }
    }

    for (let c = 0; c < numWide; c++) {
        for (let r = 0; r < numHigh - 3; r++) {
            if (board[r][c] === piece && board[r + 1][c] === piece && board[r + 2][c] === piece && board[r + 3][c] === piece) {
                return true;
            }
        }
    }

    for (let c = 0; c < numWide - 3; c++) {
        for (let r = 0; r < numHigh - 3; r++) {
            if (board[r][c] === piece && board[r + 1][c + 1] === piece && board[r + 2][c + 2] === piece && board[r + 3][c + 3] === piece) {
                return true;
            }
        }
    }

    for (let c = 0; c < numWide - 3; c++) {
        for (let r = 3; r < numHigh; r++) {
            if (board[r][c] === piece && board[r - 1][c + 1] === piece && board[r - 2][c + 2] === piece && board[r - 3][c + 3] === piece) {
                return true;
            }
        }
    }

    return false;
}

function scorePosition(board, piece) {
    let score = 0;
    const centerArray = [];
    for (let r = 0; r < numHigh; r++) {
        centerArray.push(board[r][Math.floor(numWide / 2)]);
    }
    const centerCount = centerArray.filter(cell => cell === piece).length;
    score += centerCount * 3;

    for (let r = 0; r < numHigh; r++) {
        const rowArray = board[r];
        for (let c = 0; c < numWide - 3; c++) {
            const window = rowArray.slice(c, c + 4);
            score += evaluateWindow(window, piece);
        }
    }

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

    for (let r = 0; r < numHigh - 3; r++) {
        for (let c = 0; c < numWide - 3; c++) {
            const window = [board[r][c], board[r + 1][c + 1], board[r + 2][c + 2], board[r + 3][c + 3]];
            score += evaluateWindow(window, piece);
        }
    }

    for (let r = 0; r < numHigh - 3; r++) {
        for (let c = 0; c < numWide - 3; c++) {
            const window = [board[r + 3][c], board[r + 2][c + 1], board[r + 1][c + 2], board[r][c + 3]];
            score += evaluateWindow(window, piece);
        }
    }

    return score;
}

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

function isTerminalNode(board) {
    return winningMove(board, PLAYER) || winningMove(board, AI) || getValidLocations(board).length === 0;
}

function getValidLocations(board) {
    const validLocations = [];
    for (let col = 0; col < numWide; col++) {
        if (isValidLocation(board, col)) {
            validLocations.push(col);
        }
    }
    console.log(`Valid locations: ${validLocations}`);
    return validLocations;
}

function minimax(board, depth, alpha, beta, maximizingPlayer) {
    const validLocations = getValidLocations(board);
    const isTerminal = isTerminalNode(board);

    console.log(`Minimax called with depth: ${depth}, alpha: ${alpha}, beta: ${beta}, maximizingPlayer: ${maximizingPlayer}`);
    console.log(`Valid locations at depth ${depth}: ${validLocations}`);
    console.log(`Board state at depth ${depth}:`);
    console.log(board.map(row => row.join(' ')).join('\n'));

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

    if (validLocations.length === 0) {
        console.log("No valid locations available.");
        return [null, 0];
    }

    if (maximizingPlayer) {
        let value = -Infinity;
        let column = validLocations[Math.floor(Math.random() * validLocations.length)];
        for (let col of validLocations) {
            const row = getNextOpenRow(board, col);
            if (row !== null) {
                const bCopy = board.map(row => row.slice());
                dropPiece(bCopy, row, col, AI);
                const newScore = minimax(bCopy, depth - 1, alpha, beta, false)[1];
                console.log(`Maximizing: Col: ${col}, Score: ${newScore}`);
                if (newScore > value) {
                    value = newScore;
                    column = col;
                }
                alpha = Math.max(alpha, value);
                if (alpha >= beta) {
                    break;
                }
            } else {
                console.log(`Invalid move at column ${col} (row is null).`);
            }
        }
        console.log(`Best column for maximizing player: ${column}`);
        return [column, value];
    } else {
        let value = Infinity;
        let column = validLocations[Math.floor(Math.random() * validLocations.length)];
        for (let col of validLocations) {
            const row = getNextOpenRow(board, col);
            if (row !== null) {
                const bCopy = board.map(row => row.slice());
                dropPiece(bCopy, row, col, PLAYER);
                const newScore = minimax(bCopy, depth - 1, alpha, beta, true)[1];
                console.log(`Minimizing: Col: ${col}, Score: ${newScore}`);
                if (newScore < value) {
                    value = newScore;
                    column = col;
                }
                beta = Math.min(beta, value);
                if (alpha >= beta) {
                    break;
                }
            } else {
                console.log(`Invalid move at column ${col} (row is null).`);
            }
        }
        console.log(`Best column for minimizing player: ${column}`);
        return [column, value];
    }
}

export { minimax, isValidLocation, getNextOpenRow, dropPiece, winningMove, isTerminalNode, getValidLocations };

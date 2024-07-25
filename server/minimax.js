import { numWide, numHigh } from '../common/game.mjs';

const EMPTY = ' ';
const PLAYER = 'X';
const AI = 'O';

function isValidLocation(board, col) {
    return board[numHigh - 1][col] === EMPTY;
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
    return validLocations;
}

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

function minimax(board, depth, alpha, beta, maximizingPlayer) {
    const validLocations = prioritizeColumns(board, maximizingPlayer ? AI : PLAYER);
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

    let value;
    let bestCol = validLocations[0];

    if (maximizingPlayer) {
        value = -Infinity;
        for (let col of validLocations) {
            const row = getNextOpenRow(board, col);
            if (row !== null) {
                const bCopy = board.map(row => row.slice());
                dropPiece(bCopy, row, col, AI);
                const newScore = minimax(bCopy, depth - 1, alpha, beta, false)[1];
                if (newScore > value) {
                    value = newScore;
                    bestCol = col;
                }
                alpha = Math.max(alpha, value);
                if (alpha >= beta) {
                    break;
                }
            }
        }
    } else {
        value = Infinity;
        for (let col of validLocations) {
            const row = getNextOpenRow(board, col);
            if (row !== null) {
                const bCopy = board.map(row => row.slice());
                dropPiece(bCopy, row, col, PLAYER);
                const newScore = minimax(bCopy, depth - 1, alpha, beta, true)[1];
                if (newScore < value) {
                    value = newScore;
                    bestCol = col;
                }
                beta = Math.min(beta, value);
                if (alpha >= beta) {
                    break;
                }
            }
        }
    }
    return [bestCol, value];
}

export { minimax, isValidLocation, getNextOpenRow, dropPiece, winningMove, isTerminalNode, getValidLocations };

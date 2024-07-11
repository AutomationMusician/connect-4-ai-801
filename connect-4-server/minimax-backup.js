const { columnFull, place, remove, state, numWide } = require('./game');

const maxDepth = 8;

function randomArray(size) {
    let array = [];
    for (let i = 0; i < size; i++) array.push(i);
    for (let i = size - 1; i > 0; i--) {
        const swapIndex = Math.floor((i + 1) * Math.random());
        const temp = array[i];
        array[i] = array[swapIndex];
        array[swapIndex] = temp;
    }
    return array;
}

function minimax(board, depth, alpha, beta, blue) {
    const currentState = state(board);
    if (currentState) {
        switch (currentState) {
            case "tie": return 0;
            case "blue": return (maxDepth - depth);
            case "red": return -(maxDepth - depth);
        }
    }
    if (depth === maxDepth) return 0;

    if (blue) {
        let value = Number.NEGATIVE_INFINITY;
        for (let col = 0; col < numWide; col++) {
            if (!columnFull(board, col)) {
                place(board, col, blue);
                const currentValue = minimax(board, depth + 1, alpha, beta, !blue);
                value = Math.max(value, currentValue);
                remove(board, col);
                alpha = Math.max(alpha, value);
                if (alpha >= beta) break;
            }
        }
        return value;
    } else {
        let value = Number.POSITIVE_INFINITY;
        for (let col = 0; col < numWide; col++) {
            if (!columnFull(board, col)) {
                place(board, col, blue);
                const currentValue = minimax(board, depth + 1, alpha, beta, !blue);
                value = Math.min(value, currentValue);
                remove(board, col);
                beta = Math.min(beta, value);
                if (alpha >= beta) break;
            }
        }
        return value;
    }
}

function mctsSimulation(board, blue, simulations = 1000) {
    let wins = 0;
    for (let i = 0; i < simulations; i++) {
        let tempBoard = JSON.parse(JSON.stringify(board));
        let turn = blue;
        while (true) {
            const currentState = state(tempBoard);
            if (currentState) {
                if ((currentState === "blue" && blue) || (currentState === "red" && !blue)) wins++;
                break;
            }
            const col = Math.floor(Math.random() * numWide);
            if (!columnFull(tempBoard, col)) {
                place(tempBoard, col, turn);
                turn = !turn;
            }
        }
    }
    return wins / simulations;
}

function minimaxWithMCTS(board, depth, alpha, beta, blue) {
    if (depth === maxDepth || state(board)) {
        return minimax(board, depth, alpha, beta, blue);
    }

    let bestValue = blue ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;
    let bestMove = -1;
    const randArray = randomArray(numWide);

    for (let i = 0; i < numWide; i++) {
        const col = randArray[i];
        if (!columnFull(board, col)) {
            place(board, col, blue);
            const currentValue = minimaxWithMCTS(board, depth + 1, alpha, beta, !blue);
            const mctsValue = mctsSimulation(board, blue);
            const totalValue = currentValue + mctsValue;

            if (blue) {
                if (totalValue > bestValue) {
                    bestValue = totalValue;
                    bestMove = col;
                }
                alpha = Math.max(alpha, bestValue);
            } else {
                if (totalValue < bestValue) {
                    bestValue = totalValue;
                    bestMove = col;
                }
                beta = Math.min(beta, bestValue);
            }
            remove(board, col);
            if (beta <= alpha) break;
        }
    }
    return depth === 0 ? bestMove : bestValue;
}

function minimaxBlue(board) {
    return minimaxWithMCTS(board, 0, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, true);
}

function minimaxRed(board) {
    return minimaxWithMCTS(board, 0, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, false);
}

module.exports = { minimaxBlue, minimaxRed };

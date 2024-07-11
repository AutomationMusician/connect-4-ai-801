const numWide = 7;
const numHigh = 6;

function columnFull(board, col) {
    return board[col][numHigh - 1] !== "white";
}

function place(board, col, blue) {
    for (let row = 0; row < numHigh; row++) {
        if (board[col][row] === "white") {
            board[col][row] = blue ? "blue" : "red";
            break;
        }
    }
}

function remove(board, col) {
    for (let row = numHigh - 1; row >= 0; row--) {
        if (board[col][row] !== "white") {
            board[col][row] = "white";
            break;
        }
    }
}

function state(board) {
    const numWide = board[0].length;
    const numHigh = board.length;

    function checkLine(a, b, c, d) {
        // Check if all four pieces are the same and not empty
        return (a !== "white" && a === b && a === c && a === d);
    }

    // Check for horizontal wins
    for (let row = 0; row < numHigh; row++) {
        for (let col = 0; col < numWide - 3; col++) {
            if (checkLine(board[row][col], board[row][col + 1], board[row][col + 2], board[row][col + 3])) {
                return board[row][col];
            }
        }
    }

    // Check for vertical wins
    for (let col = 0; col < numWide; col++) {
        for (let row = 0; row < numHigh - 3; row++) {
            if (checkLine(board[row][col], board[row + 1][col], board[row + 2][col], board[row + 3][col])) {
                return board[row][col];
            }
        }
    }

    // Check for diagonal (bottom left to top right) wins
    for (let row = 0; row < numHigh - 3; row++) {
        for (let col = 0; col < numWide - 3; col++) {
            if (checkLine(board[row][col], board[row + 1][col + 1], board[row + 2][col + 2], board[row + 3][col + 3])) {
                return board[row][col];
            }
        }
    }

    // Check for diagonal (top left to bottom right) wins
    for (let row = 3; row < numHigh; row++) {
        for (let col = 0; col < numWide - 3; col++) {
            if (checkLine(board[row][col], board[row - 1][col + 1], board[row - 2][col + 2], board[row - 3][col + 3])) {
                return board[row][col];
            }
        }
    }

    // Check for tie
    let full = true;
    for (let col = 0; col < numWide; col++) {
        if (board[0][col] === "white") {
            full = false;
            break;
        }
    }
    if (full) {
        return "tie";
    }

    // Game is still ongoing
    return null;
}

module.exports = {
    columnFull,
    place,
    remove,
    state,
    numWide,
    numHigh
};

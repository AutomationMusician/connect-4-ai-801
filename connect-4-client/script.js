const socket = io();
const numWide = 7;
const numHigh = 6;
let finished = false;
let twoAI = false;
let moves = [];

function boxId(col, row) {
    return "col" + col + "row" + row;
}

function getBoard() {
    const board = [];
    for (let col = 0; col < numWide; col++) {
        const column = [];
        for (let row = 0; row < numHigh; row++) {
            const elem = document.getElementById(boxId(col, row));
            column.push(elem.style.background);
        }
        board.push(column);
    }
    return board;
}

function winner(set) {
    const c = set[0];
    if (c == "white") return "none";
    let same = true;
    for (let i = 1; same && i < set.length; i++) {
        if (c != set[i]) same = false;
    }
    return same ? c : "none";
}

function createEmptySet() {
    return ["white", "white", "white", "white"];
}

function state(board) {
    let set;
    for (let col = 0; col < numWide; col++) {
        set = createEmptySet();
        for (let row = 0; row < numHigh; row++) {
            set[row % 4] = board[col][row];
            const winningPlayer = winner(set);
            if (winningPlayer != "none") {
                return winningPlayer;
            }
        }
    }
    for (let row = 0; row < numHigh; row++) {
        set = createEmptySet();
        for (let col = 0; col < numWide; col++) {
            set[col % 4] = board[col][row];
            const winningPlayer = winner(set);
            if (winningPlayer != "none") return winningPlayer;
        }
    }
    for (let row = 0; row < numHigh - 3; row++) {
        for (let col = 0; col < numWide - 3; col++) {
            set = createEmptySet();
            for (let i = 0; i < set.length; i++) {
                set[i] = board[col + i][row + i];
                const winningPlayer = winner(set);
                if (winningPlayer != "none") return winningPlayer;
            }
        }
    }
    for (let row = 3; row < numHigh; row++) {
        for (let col = 0; col < numWide - 3; col++) {
            set = createEmptySet();
            for (let i = 0; i < set.length; i++) {
                set[i] = board[col + i][row - i];
                const winningPlayer = winner(set);
                if (winningPlayer != "none") return winningPlayer;
            }
        }
    }
    let full = true;
    for (let col = 0; full && col < numWide; col++) {
        for (let row = 0; full && row < numHigh; row++) {
            if (board[col][row] == "white") full = false;
        }
    }
    if (full) return "tie";
    else return "incomplete";
}

function showState(state) {
    const elem = document.getElementById("gameState");
    finished = true;
    switch (state) {
        case "blue":
            elem.textContent = "Blue Wins!";
            elem.style.color = "blue";
            break;
        case "red":
            elem.textContent = "Red Wins!";
            elem.style.color = "red";
            break;
        case "tie":
            elem.textContent = "It's a tie!";
            elem.style.color = "purple";
            break;
        default:
            finished = false;
    }
}

function changeAI() {
    twoAI = !twoAI;
    document.getElementById("changeAI").textContent = twoAI ? "Play Against AI" : "AI vs. AI";
    if (twoAI) {
        while (!finished) {
            if (!finished) placeBlueAI();
            if (!finished) placeRed();
        }
    }
}

function undo() {
    if (moves.length > 1) {
        for (let i = 0; i < 2; i++) {
            const col = moves.pop();
            for (let row = numHigh - 1; row >= 0; row--) {
                const dataElem = document.getElementById(boxId(col, row));
                if (dataElem.style.background != "white") {
                    dataElem.style.background = "white";
                    break;
                }
            }
        }
    }
    document.getElementById("undo").disabled = (moves.length <= 1);
    document.getElementById("playRed").disabled = (moves.length > 0);
    document.getElementById("gameState").textContent = "";
    finished = false;
}

function place(board, col, blue) {
    for (let row = 0; row < numHigh; row++) {
        const elem = document.getElementById(boxId(col, row));
        if (elem.style.background == "white") {
            elem.style.background = blue ? "blue" : "red";
            break;
        }
    }
    board = getBoard();
    const currentState = state(board);
    showState(currentState);
    moves.push(col);
}

function placeBlueAI() {
    let board = getBoard();
    const blueCol = minimaxBlue(board);
    place(board, blueCol, true);
}

function placeRed() {
    let board = getBoard();
    asyncMinimaxRed(board).then((col) => {
        place(board, col, false);
    });
}

function clearBoard() {
    for (let row = 0; row < numHigh; row++) {
        for (let col = 0; col < numWide; col++) {
            const elem = document.getElementById(boxId(col, row));
            elem.style.background = "white";
        }
    }
    document.getElementById("playRed").disabled = false;
    document.getElementById("undo").disabled = true;
    document.getElementById("gameState").textContent = "";
    finished = false;
    moves = [];
}

function click(col) {
    let board = getBoard();
    if (!columnFull(board, col)) {
        if (!finished) place(board, col, true);
        if (!finished) placeRed();
    }
}

socket.on('move', (data) => {
    const { move, player } = data;
    if (player === 'blue') {
        placeBlueAI();
    } else {
        placeRed();
    }
});

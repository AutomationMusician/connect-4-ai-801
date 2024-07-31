//------------------------------------------- imports -----------------------------------------------
import { GameBoard, numWide, numHigh, emptyBoardXOFormat } from '../common/game.mjs';

//---------------------------------------- global vars ----------------------------------------------
const playerColorToChar = {
    "blue": 'O',
    "red": 'X',
    "white": ' '
};

let blueFirst = true;
let finished = false;
let moveInProgress = false;

//-------------------------------- statically generated html content -------------------------------

/**
 * Get DOM Element ID of td item for box in column col and row row
 * @param {integer} col 
 * @param {integer} row 
 * @returns {string} DOM Element ID of td item for box in column col and row row
 */
function boxId(col, row) {
    return "col" + col + "row" + row;
}

/**
 * Dynamically setup Connect 4 HTML table
 * @returns {void}
 */
function setupTable() {
    const toolbarElems = document.getElementsByClassName("toolbar");
    for (let toolbarElem of toolbarElems) {
        toolbarElem.colSpan = numWide;
    }

    const tbody = document.getElementById("tbody");
    const rows = [];
    for (let row = 0; row < numHigh; row++) {
        const rowElem = document.createElement("tr");
        for (let col = 0; col < numWide; col++) {
            const dataElem = document.createElement("td");
            dataElem.id = boxId(col, row);
            dataElem.style.background = "white";
            dataElem.onclick = function () { click(col); };
            rowElem.append(dataElem);
        }
        rows.push(rowElem);
    }
    while (rows.length > 0) {
        tbody.append(rows.pop());
    }
}

setupTable();

/**
 * Reset board
 * @returns {void}
 */
async function clearBoard() {
    for (let row = 0; row < numHigh; row++) {
        for (let col = 0; col < numWide; col++) {
            const elem = document.getElementById(boxId(col, row));
            elem.style.background = "white";
        }
    }
    document.getElementById("gameStatus").textContent = "";
    finished = false;

    // if red is playing first, play it now.
    if (!blueFirst) {
        moveInProgress = true;
        const aiMoveCol = await getAiMove();
        place(aiMoveCol, "red");
        moveInProgress = false;
    }
}
// bind element to this function
document.getElementById("clearBoard").onclick = clearBoard;

const changeFirstPlayerButton = document.getElementById('changeFirstPlayer');
/**
 * Change which player is starting first and restart the game.
 * @returns {void}
 */
function changeFirstPlayer() {
    if (blueFirst) {
        changeFirstPlayerButton.textContent = "Play Blue First";
    }
    else {
        changeFirstPlayerButton.textContent = "Play Red First";
    }
    blueFirst = !blueFirst;
    clearBoard();
}
changeFirstPlayerButton.onclick = changeFirstPlayer;

//------------------------------------------ dynamic actions -----------------------------------------

/**
 * Generate a GameBoard object from the DOM table
 * @returns {GameBoard} GameBoard object representing the current game state
 */
function getGameBoard() {
    const gameBoard = new GameBoard(emptyBoardXOFormat);
    for (let row = 0; row < numHigh; row++) {
        for (let col = 0; col < numWide; col++) {
            const elem = document.getElementById(boxId(col, row));
            gameBoard.board[row][col] = playerColorToChar[elem.style.background];
        }
    }
    return gameBoard;
}

function getModel() {
    return document.getElementById("model").value;
}

/**
 * Update HTML if the game is finished to clearly show a winner or a tie. If the game is unfinished, do nothing.
 * @param {character} status status of the current game
 * @returns {void}
 */
function showStatus(status) {
    const elem = document.getElementById("gameStatus");
    finished = true;
    switch (status) {
        case 'O':
            elem.textContent = "Blue Wins!";
            elem.style.color = "blue";
            break;
        case 'X':
            elem.textContent = "Red Wins!";
            elem.style.color = "red";
            break;
        case 'T':
            elem.textContent = "It's a tie!";
            elem.style.color = "purple";
            break;
        default:
            finished = false;
    }
}

/**
 * Update the HTML to show that a new piece was played and update the status if the game is finished.
 * @param {integer} col
 * @param {string} playerColor color of player: "blue" or "red"
 * @returns {void}
 */
function place(col, playerColor) {
    let piecePlaced = false;
    for (let row = 0; row < numHigh; row++) {
        const elem = document.getElementById(boxId(col, row));
        if (elem.style.background === "white") {
            elem.style.background = playerColor;
            piecePlaced = true;
            break;
        }
    }
    if (!piecePlaced) {
        console.error(`${playerColor} piece could not be placed because column index ${col} is full`);
        return;
    }
    const gameBoard = getGameBoard();
    const currentStatus = gameBoard.status();
    showStatus(currentStatus);
}

/**
 * Runs actions to run when a column in the table is clicked: Ff the game isn't finished place blue piece. Ff the game still isn't finished, get AI response move and place their piece.
 * @param {integer} col column clicked
 * @returns {void}
 */
async function click(col) {
    // prevent moves from happening before the next move can happen
    if (moveInProgress) return;
    moveInProgress = true;

    if (finished) {
        moveInProgress = false;
        return;
    }

    // place blue piece
    place(col, "blue");

    // place red piece
    if (finished) {
        moveInProgress = false;
        return;
    }
    const aiMoveCol = await getAiMove();
    place(aiMoveCol, "red");
    moveInProgress = false;
}

//------------------------------------------ API handlers -----------------------------------------

/**
 * Get AI Move by querying the server with the current board state 
 * and getting a column back where the AI chose to move.
 * @returns {Promise<integer>} column where the AI chose to play
 */
async function getAiMove() {
    const gameBoard = getGameBoard();
    const model = getModel();
    const response = await fetch(`/api/next-move/${model}/${gameBoard.toXOFormat()}`);
    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }
    const responseText = await response.text();
    return Number(responseText);
}


import { GameBoard, emptyBoardXOFormat, filpXO }  from 'common/game';

async function playGame() {
    const gameBoard = new GameBoard(emptyBoardXOFormat); // create blank board
    let gameStatus = 'U';

    const players = ['X', 'O']; 
    const nextMoveFunction = {
        'X': getThisModelMove,
        'O': getOtherModelMove
    }
    let currentPlayerIndex = 0;

    while (gameStatus === 'U')
    {
        const currentPlayer = players[currentPlayerIndex];
        const move = await nextMoveFunction[currentPlayer](gameBoard.toXOFormat());
        gameBoard.place(move, currentPlayer);
        gameStatus = gameBoard.status();
        console.log(`${currentPlayer} played in column ${move}. Game board is now: ${gameBoard.toXOFormat()}`);
        currentPlayerIndex = (currentPlayerIndex + 1) % players.length; // increment or go back to beginning if we are at the end
    }
    console.log("Game status = " + gameStatus);
}


async function getThisModelMove(xoformat) {
    const response = await fetch(`http://localhost:3000/api/next-move/${xoformat}`);
    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }
    const responseText = await response.text();
    return Number(responseText);
}

async function getOtherModelMove(xoformat) {
    xoformat = filpXO(xoformat);
    const response = await fetch(`https://tleemann.de/php/four.php?move=${xoformat}&level=hard`);
    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }
    const responseText = await response.text();
    return Number(responseText);
}

playGame();
import { GameBoard, emptyBoardXOFormat, filpXO }  from 'common/game';

async function playGame(startingPlayer, difficulty) {
    const gameBoard = new GameBoard(emptyBoardXOFormat); // create blank board
    let gameStatus = 'U';
    let currentPlayer = startingPlayer;

    while (gameStatus === 'U')
    {
        let move;
        let nextPlayer;
        if (currentPlayer === 'X') {
            move = await getThisModelMove(gameBoard.toXOFormat());
            nextPlayer = 'O';
        }
        else {
            move = await getOtherModelMove(gameBoard.toXOFormat(), difficulty);
            if (gameBoard.nextAvailableRow(move) === -1) {
                const availableCols = gameBoard.availableColumns()
                const newMove = availableCols[Math.floor(Math.random() * availableCols.length)];
                console.log(`Opponent illegally played column ${move} for the game board '${gameBoard.toXOFormat()}'. Randomly playing column ${newMove} instead. Game info: starting player: ${startingPlayer}; difficulty: ${difficulty}`);
                move = newMove;
            }
            nextPlayer = 'X';
        }
        gameBoard.place(move, currentPlayer);
        gameStatus = gameBoard.status();
        currentPlayer = nextPlayer;
    }
    return gameStatus;
}


async function getThisModelMove(xoformat) {
    const response = await fetch(`http://localhost:3000/api/next-move/${xoformat}`);
    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }
    const responseText = await response.text();
    return Number(responseText);
}

async function getOtherModelMove(xoformat, difficulty) {
    xoformat = filpXO(xoformat);
    const response = await fetch(`https://tleemann.de/php/four.php?move=${xoformat}&level=${difficulty}`);
    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }
    const responseText = await response.text();
    return Number(responseText);
}


const difficulties = ['easy', 'hard', 'pro'];
// const difficulties = ['easy', 'hard'];
const players = ['X', 'O'];
const numGamesPerScenario = 1;

// asynchronously start all games
const gameStatusPromises = [];
difficulties.forEach(difficulty => {
    players.forEach(startingPlayer => {
        for (let i=0; i<numGamesPerScenario; i++) {
            gameStatusPromises.push(playGame(startingPlayer,difficulty));
        }
    });
});

// TODO: figure out how to evaluate without timing out
// wait for games to complete and then output the results
Promise.all(gameStatusPromises).then(gameStatuses => {
    const outputTable = [];
    let index = 0;
    difficulties.forEach(difficulty => {
        players.forEach(startingPlayer => {

            const row = {
                difficulty,
                startingPlayer,
                'X': 0,
                'O': 0,
                'T': 0
            };
            for (let i=0; i<numGamesPerScenario; i++) {
                const result = gameStatuses[index];
                row[result]++;
                index++;
            }
            outputTable.push(row);
        });
    });
    console.table(outputTable);
});
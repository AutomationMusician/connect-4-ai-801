import { GameBoard, emptyBoardXOFormat, filpXO }  from 'common/game';

const numGamesPerScenario = 10;
const models = ['random', 'minimax', 'minimax-with-heuristic'];
const difficulties = ['easy', 'hard', 'pro'];

const players = ['X', 'O'];
const XOT2WinTieLoss = {
    'X': 'win',
    'O': 'loss',
    'T': 'tie'
}

async function evaluateModel() {
    const outputTable = [];
    for (let model of models) {
        for (let difficulty of difficulties) {
            for (let startingPlayer of players) {
                const startingPlayerPlainText = startingPlayer === 'X' ? "this model" : "opposing model";
                const row = {
                    model,
                    difficulty,
                    startingPlayer: startingPlayerPlainText,
                    win: 0,
                    loss: 0,
                    tie: 0
                }
                for (let i=0; i<numGamesPerScenario; i++) {
                    const gameStatus = await playGame(startingPlayer, model, difficulty);
                    const result = XOT2WinTieLoss[gameStatus];
                    console.log({
                        model,
                        difficulty,
                        startingPlayer: startingPlayerPlainText,
                        result
                    });
                    row[result]++;
                }
                outputTable.push(row);
            }
        }

    }
    console.table(outputTable);
}

async function playGame(startingPlayer, model, difficulty) {
    const gameBoard = new GameBoard(emptyBoardXOFormat); // create blank board
    let gameStatus = 'U';
    let currentPlayer = startingPlayer;

    while (gameStatus === 'U')
    {
        let move;
        let nextPlayer;
        if (currentPlayer === 'X') {
            move = await getThisModelMove(gameBoard.toXOFormat(), model);
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


async function getThisModelMove(xoformat, model) {
    const response = await fetch(`http://localhost:3000/api/next-move/${model}/${xoformat}`);
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

evaluateModel();
import { GameBoard, numHigh, numWide, lineSize } from 'common/game';

// evaluate the numHits for every spot in the board
const numHitsArray = [...Array(numHigh)].map(e => Array(numWide).fill(0));
for (let row=0; row<numHigh; row++) {
    for (let col=0; col<numWide; col++) {
        numHitsArray[row][col] = numHits(row,col);
    }
}

/**
 * Calculate the number of lines that a cell at row,col can be in
 * @param {integer} row 
 * @param {integer} col 
 * @returns {integer} the number of lines that the cell at row,col can be in
 */
function numHits(row, col) {
    const distanceFromTopBottom = row < numHigh - row - 1 ? row : numHigh - row - 1;
    const distanceFromLeftRight = col < numWide - col - 1 ? col : numWide - col - 1;
    const numHorizontalLines = distanceFromLeftRight+1
    const numVerticalLines = distanceFromTopBottom+1
    const numDiagonalUpRight = distanceFromTopBottom < distanceFromLeftRight ? distanceFromTopBottom + 1 : distanceFromLeftRight + 1;
    const numDiagonalUpLeftLinesNoConstraints = distanceFromTopBottom + distanceFromLeftRight - lineSize + 2;
    const numDiagonalUpLeftLinesMaxSize = numDiagonalUpLeftLinesNoConstraints > lineSize ? lineSize : numDiagonalUpLeftLinesNoConstraints;
    const numDiagonalUpLeftLinesMinZero = numDiagonalUpLeftLinesMaxSize < 0 ? 0 : numDiagonalUpLeftLinesMaxSize;
    return numHorizontalLines + numVerticalLines + numDiagonalUpRight + numDiagonalUpLeftLinesMinZero;
}

/**
 * Evaluate the GameBoard with a heuristic
 * @param {GameBoard} gameBoard 
 * @param {character} nextPlayer 
 * @returns {number} score of GameBoard based on the heuristic
 */
export function heuristic(gameBoard, nextPlayer) {
    const totalHits = {
        'X': 0,
        'O': 0,
        ' ': 0
    };
    for (let rowIndex=0; rowIndex<gameBoard.board.length; rowIndex++) {
        const row = gameBoard.board[rowIndex];
        for (let colIndex=0; colIndex<row.length; colIndex++) {
            const player = row[colIndex];
            totalHits[player] += numHitsArray[rowIndex][colIndex];
        }
    }
    let nextMoveMaxNumHits = 0;
    for (let col=0; col<numWide; col++) {
        const row = gameBoard.nextAvailableRow(col);
        if (row === -1)
            continue;
        const hits = numHits(row, col);
        if (hits > nextMoveMaxNumHits) {
            nextMoveMaxNumHits = hits;
        }
    }
    totalHits[nextPlayer] += nextMoveMaxNumHits;
    return (totalHits['X'] - totalHits['O'])/(totalHits['X'] + totalHits['O'])
}

export const numWide = 7;
export const numHigh = 6;
export const emptyBoardXOFormat = Array(numHigh).fill('.').join('');

/**
 * A mutable class representing a game board
 */
export class GameBoard {
    /**
     * Constructor to create a board from XO-format
     * @param {string} xoFormat 
     */
    constructor(xoFormat) {
        /** @type {character[][]} */
        this.board = [...Array(numHigh)].map(e => Array(numWide).fill(' '));
        let col = 0;
        let row = 0;
        for (let charIndex = 0; charIndex < xoFormat.length; charIndex++) {
            const char = xoFormat[charIndex];
            if (char === '.') {
                col++;
                row = 0;
            }
            else {
                this.board[row][col] = char;
                row++;
            }
        }
    }

    /**
     * Boolean check if a column is full
     * @param {integer} col column to check
     * @returns {boolean} if column is full
     */
    columnFull(col) {
        return this.board[numHigh - 1][col] !== ' ';
    }

    /**
     * Gets all the available column indices where a move can be made.
     *
     * @param {GameBoard} board - The current state of the Connect Four game board.
     * @returns {Array<number>} - An array of available column indices.
     */
    availableColumns() {
        const validLocations = [];
        for (let col = 0; col < numWide; col++) {
            if (!this.columnFull(col)) {
                validLocations.push(col);
            }
        }
        return validLocations;
    }
    
    /**
     * Place a piece in the board
     * @param {integer} col column to place a piece
     * @param {character} player 'X','O', or ' '
     */
    place(col, player) {
        for (let row = 0; row < numHigh; row++) {
            if (this.board[row][col] === ' ') {
                this.board[row][col] = player;
                break;
            }
        }
    }
    
    /**
     * Remove the last piece played in a column
     * @param {*} col column where the piece will be removed
     */
    remove(col) {
        for (let row = numHigh - 1; row >= 0; row--) {
            if (this.board[row][col] !== ' ') {
                this.board[row][col] = ' ';
                break;
            }
        }
    }

    // TODO: test this more thoroughly. I've noted that lots of wins aren't counted as wins.
    /**
     * Check the status of the game
     * @returns {character} 'X' for X win, 'O' for O win, 'T' for tie, and 'U' if the game is unfinished
     */
    status() {
        function checkLine(a, b, c, d) {
            // Check if all four pieces are the same and not empty
            return (a !== ' ' && a === b && a === c && a === d);
        }
    
        // Check for horizontal wins
        for (let row = 0; row < numHigh; row++) {
            for (let col = 0; col < numWide - 3; col++) {
                if (checkLine(this.board[row][col], this.board[row][col + 1], this.board[row][col + 2], this.board[row][col + 3])) {
                    return this.board[row][col];
                }
            }
        }
    
        // Check for vertical wins
        for (let row = 0; row < numHigh - 3; row++) {
            for (let col = 0; col < numWide; col++) {
                if (checkLine(this.board[row][col], this.board[row + 1][col], this.board[row + 2][col], this.board[row + 3][col])) {
                    return this.board[row][col];
                }
            }
        }
    
        // Check for diagonal (bottom left to top right) wins
        for (let row = 0; row < numHigh - 3; row++) {
            for (let col = 0; col < numWide - 3; col++) {
                if (checkLine(this.board[row][col], this.board[row + 1][col + 1], this.board[row + 2][col + 2], this.board[row + 3][col + 3])) {
                    return this.board[row][col];
                }
            }
        }
    
        // Check for diagonal (top left to bottom right) wins
        for (let row = 3; row < numHigh; row++) {
            for (let col = 0; col < numWide - 3; col++) {
                if (checkLine(this.board[row][col], this.board[row - 1][col + 1], this.board[row - 2][col + 2], this.board[row - 3][col + 3])) {
                    return this.board[row][col];
                }
            }
        }
    
        // Check if there are still available moves
        for (let col = 0; col < numWide; col++) {
            if (!this.columnFull(col)) {
                // Game is unfinished
                return 'U';
            }
        }
        
        // no winners and no available moves, so it is a tie
        return 'T';
    }

    /**
     * Export board state in XO-Format
     * @returns {string} board in XO-Format
     */
    toXOFormat() {
        const output = [];
        for (let col = 0; col < numWide; col++) {
            for (let row = 0; row < numHigh; row++) {
                if (this.board[row][col] === ' ') break;
                output.push(this.board[row][col]);
            }
            output.push('.');
        }
        return output.join('');
    }
}

/**
 * Flips characters in XO format so that Xs and Os are swapped
 * @param {string} xoformat input xoformat
 * @returns {string} output xoformat
 */
export function filpXO(xoformat) {
    return xoformat
            .replaceAll('X', '_') // replace X with temp value "_"
            .replaceAll('O', 'X') // replace O with X
            .replaceAll('_', 'O'); // replace temp "_" with 'O'
}
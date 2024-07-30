export const numWide = 7;
export const numHigh = 6;
export const lineSize = 4;
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
        const row = this.nextAvailableRow(col);
        if (row === -1)
            throw Error(`Column ${col} is full. There is no available row to place the piece in. Current board state is ${this.toXOFormat()}`);
        this.board[row][col] = player;
    }

    /**
     * Determine the next available row in a column
     * @param {integer} col column to search for the next best row
     * @returns {integer} next available row
     */
    nextAvailableRow(col) {
        for (let row = 0; row < numHigh; row++) {
            if (this.board[row][col] === ' ') {
                return row;
            }
        }
        return -1;
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

    /**
     * Loop over all of the lines in the board with a certain size
     * @param {integer} size size of the lines to check
     * @param {(line: character[]) => boolean} callback callback function which should return true to break out of the loop
     * @returns {void}
     */
    loopOverLines(size, callback) {
        // iterate over horizontal lines
        for (let row = 0; row < numHigh; row++) {
            for (let col = 0; col <= numWide - size; col++) {
                const line = [];
                for (let i=0; i<size; i++) {
                    line.push(this.board[row][col + i]);
                }
                const breakOutOfLoop = callback(line);
                if (breakOutOfLoop) return;
            }
        }
    
        // iterations over vertical lines
        for (let row = 0; row <= numHigh - size; row++) {
            for (let col = 0; col < numWide; col++) {
                const line = [];
                for (let i=0; i<size; i++) {
                    line.push(this.board[row + i][col]);
                }
                const breakOutOfLoop = callback(line);
                if (breakOutOfLoop) return;
            }
        }
    
        // iterate over diagonal (bottom left to top right) lines
        for (let row = 0; row <= numHigh - size; row++) {
            for (let col = 0; col < numWide - size; col++) {
                const line = [];
                for (let i=0; i<size; i++) {
                    line.push(this.board[row + i][col + i]);
                }
                const breakOutOfLoop = callback(line);
                if (breakOutOfLoop) return;
            }
        }
    
        // iterate over diagonal (top left to bottom right) lines
        for (let row = size - 1; row < numHigh; row++) {
            for (let col = 0; col <= numWide - size; col++) {
                const line = [];
                for (let i=0; i<size; i++) {
                    line.push(this.board[row - i][col + i]);
                }
                const breakOutOfLoop = callback(line);
                if (breakOutOfLoop) return;
            }
        }
    }

    /**
     * Check the status of the game
     * @returns {character} 'X' for X win, 'O' for O win, 'T' for tie, and 'U' if the game is unfinished
     */
    status() {
        let winner = ' ';
    
        this.loopOverLines(4, (line) => {
            if (line[0] === ' ')
                return false;
            for (let i=1; i<line.length; i++) {
                if (line[0] !== line[i]) {
                    return false;
                }
            }
            winner = line[0];
            return true;
        });
        if (winner !== ' ')
            return winner;
    
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
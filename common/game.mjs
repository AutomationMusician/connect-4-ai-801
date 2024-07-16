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
        this.board = [...Array(numWide)].map(e => Array(numHigh).fill(' '));
        let col = 0;
        let row = 0;
        for (let charIndex = 0; charIndex < xoFormat.length; charIndex++) {
            const char = xoFormat[charIndex];
            if (char === '.') {
                col++;
                row = 0;
            }
            else {
                this.board[col][row] = char;
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
        return this.board[col][numHigh - 1] !== ' ';
    }
    
    /**
     * Place a piece in the board
     * @param {integer} col column to place a piece
     * @param {character} player 'X','O', or ' '
     * @returns {boolean} if column is full
     */
    place(col, player) {
        for (let row = 0; row < numHigh; row++) {
            if (this.board[col][row] === ' ') {
                this.board[col][row] = player;
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
            if (this.board[col][row] !== ' ') {
                this.board[col][row] = ' ';
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
        for (let col = 0; col < numWide - 3; col++) {
            for (let row = 0; row < numHigh; row++) {
                if (checkLine(this.board[col][row], this.board[col + 1][row], this.board[col + 2][row], this.board[col + 3][row])) {
                    return this.board[col][row];
                }
            }
        }
    
        // Check for vertical wins
        for (let col = 0; col < numWide; col++) {
            for (let row = 0; row < numHigh - 3; row++) {
                if (checkLine(this.board[col][row], this.board[col][row + 1], this.board[col][row + 2], this.board[col][row + 3])) {
                    return this.board[col][row];
                }
            }
        }
    
        // Check for diagonal (bottom left to top right) wins
        for (let col = 0; col < numWide - 3; col++) {
            for (let row = 0; row < numHigh - 3; row++) {
                if (checkLine(this.board[col][row], this.board[col + 1][row + 1], this.board[col + 2][row + 2], this.board[col + 3][row + 3])) {
                    return this.board[col][row];
                }
            }
        }
    
        // Check for diagonal (top left to bottom right) wins
        for (let col = 0; col < numWide - 3; col++) {
            for (let row = 3; row < numHigh; row++) {
                if (checkLine(this.board[col][row], this.board[col + 1][row - 1], this.board[col + 2][row - 2], this.board[col + 3][row - 3])) {
                    return this.board[col][row];
                }
            }
        }
    
        // Check for tie
        let full = true;
        for (let col = 0; col < numWide; col++) {
            if (!columnFull(col)) {
                // Game is unfinished
                return 'U';
            }
        }

        // board is full, its a tie!
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
                if (this.board[col][row] === ' ') break;
                output.push(this.board[col][row]);
            }
            output.push('.');
        }
        return output.join('');
    }
}

const numWide = 7;
const numHigh = 6;

class Connect4 {
    constructor() {
        this.finished = false;
        this.twoAI = false;
        this.moves = [];
        this.board = Array.from({ length: numHigh }, () => Array(numWide).fill('white'));
    }

    boxId(col, row) {
        return "col" + col + "row" + row;
    }

    getBoard() {
        return this.board;
    }

    winner(set) {
        const c = set[0];
        if (c === "white") return "none";
        let same = true;
        for (let i = 1; same && i < set.length; i++) {
            if (c !== set[i]) same = false;
        }
        return same ? c : "none";
    }

    createEmptySet() {
        return ["white", "white", "white", "white"];
    }

    state(board) {
        let set;

        for (let col = 0; col < numWide; col++) {
            set = this.createEmptySet();
            for (let row = 0; row < numHigh; row++) {
                set[row % 4] = board[col][row];
                const winningPlayer = this.winner(set);
                if (winningPlayer !== "none") {
                    return winningPlayer;
                }
            }
        }

        for (let row = 0; row < numHigh; row++) {
            set = this.createEmptySet();
            for (let col = 0; col < numWide; col++) {
                set[col % 4] = board[col][row];
                const winningPlayer = this.winner(set);
                if (winningPlayer !== "none") return winningPlayer;
            }
        }

        for (let row = 0; row < numHigh - 3; row++) {
            for (let col = 0; col < numWide - 3; col++) {
                set = this.createEmptySet();
                for (let i = 0; i < set.length; i++) {
                    set[i] = board[col + i][row + i];
                    const winningPlayer = this.winner(set);
                    if (winningPlayer !== "none") return winningPlayer;
                }
            }
        }

        for (let row = 3; row < numHigh; row++) {
            for (let col = 0; col < numWide - 3; col++) {
                set = this.createEmptySet();
                for (let i = 0; i < set.length; i++) {
                    set[i] = board[col + i][row - i];
                    const winningPlayer = this.winner(set);
                    if (winningPlayer !== "none") return winningPlayer;
                }
            }
        }

        let full = true;
        for (let col = 0; full && col < numWide; col++) {
            for (let row = 0; full && row < numHigh; row++) {
                if (board[col][row] === "white") full = false;
            }
        }
        return full ? "tie" : "incomplete";
    }

    showState(state) {
        const elem = document.getElementById("gameState");
        this.finished = true;
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
                this.finished = false;
        }
    }

    changeAI() {
        this.twoAI = !this.twoAI;
        document.getElementById("changeAI").textContent = this.twoAI ? "Play Against AI" : "AI vs. AI";

        if (this.twoAI) {
            while (!this.finished) {
                if (!this.finished) this.placeBlueAI();
                if (!this.finished) this.placeRed();
            }
        }
    }

    undo() {
        if (this.moves.length > 1) {
            for (let i = 0; i < 2; i++) {
                const col = this.moves.pop();
                for (let row = numHigh - 1; row >= 0; row--) {
                    const dataElem = document.getElementById(this.boxId(col, row));
                    if (dataElem.style.background !== "white") {
                        dataElem.style.background = "white";
                        break;
                    }
                }
            }
        }

        document.getElementById("undo").disabled = (this.moves.length <= 1);
        document.getElementById("playRed").disabled = (this.moves.length > 0);
        document.getElementById("gameState").textContent = "";
        this.finished = false;
    }

    columnFull(board, col) {
        return (board[col][numHigh - 1] !== "white");
    }

    place(board, col, blue) {
        for (let row = 0; row < numHigh; row++) {
            if (board[col][row] === "white") {
                board[col][row] = blue ? "blue" : "red";
                break;
            }
        }
    }

    remove(board, col) {
        for (let row = numHigh - 1; row >= 0; row--) {
            if (board[col][row] !== "white") {
                board[col][row] = "white";
                break;
            }
        }
    }

    clearBoard() {
        for (let row = 0; row < numHigh; row++) {
            for (let col = 0; col < numWide; col++) {
                const elem = document.getElementById(this.boxId(col, row));
                elem.style.background = "white";
            }
        }
        document.getElementById("playRed").disabled = false;
        document.getElementById("undo").disabled = true;
        document.getElementById("gameState").textContent = "";
        this.finished = false;
        this.moves = [];
    }

    placeBlue(board, col) {
        for (let row = 0; row < numHigh; row++) {
            const elem = document.getElementById(this.boxId(col, row));
            if (elem.style.background === "white") {
                elem.style.background = "blue";
                break;
            }
        }
        this.board = board;
        const currentState = this.state(this.board);
        this.showState(currentState);
        this.moves.push(col);
    }

    async placeBlueAI() {
        let board = this.getBoard();
        const blueCol = await minimaxBlue(board);
        for (let row = 0; row < numHigh; row++) {
            const elem = document.getElementById(this.boxId(blueCol, row));
            if (elem.style.background === "white") {
                elem.style.background = "blue";
                break;
            }
        }
        this.board = this.getBoard();
        const currentState = this.state(this.board);
        this.showState(currentState);
        this.moves.push(blueCol);
        document.getElementById("playRed").disabled = true;
        document.getElementById("undo").disabled = false;
    }

    async placeRed() {
        let board = this.getBoard();
        const col = await asyncMinimaxRed(board);
        for (let row = 0; row < numHigh; row++) {
            const elem = document.getElementById(this.boxId(col, row));
            if (elem.style.background === "white") {
                elem.style.background = "red";
                break;
            }
        }
        this.board = this.getBoard();
        const currentState = this.state(this.board);
        this.showState(currentState);
        this.moves.push(col);
        document.getElementById("playRed").disabled = true;
        document.getElementById("undo").disabled = false;
    }

    click(col) {
        let board = this.getBoard();
        if (!this.columnFull(board, col)) {
            if (!this.finished) this.placeBlue(board, col);
            if (!this.finished) this.placeRed();
        }
    }
}

module.exports = Connect4;

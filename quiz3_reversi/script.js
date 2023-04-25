
// Quiz test instructions:
// ==========================
// 1. Check slot available					[X]
// 2. Flipped over opponent's piece		    [X]
// 3. Write victory condition				[X]
// 4. Write draw condition					[X]
// 5. Show where you can put the piece		[X]
// 6. Score display						    [X]
// 7. Regret piece							[X]
// 8. Play by tip							[X]
// 9. Player vs Computer					[X]
//
//
// ==========================
// * Try your best to complete the above quiz
// * You may skip the task when you can't complete it
//
// ! The AI is not perfect. Although it uses minimax algorithm, it is not a perfect AI:
// ! 1. The heuristic function is simply considering the number of pieces on the board, which is not 
// !    a good heuristic function for Reversi.
// ! 2. The minimax algorithm only recurses up to certain depth, without considering the end of the game.



//=============================
// Classes
//=============================
// Simple vector2 - x, y
class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    move(dx, dy) {
        return new Vector2(this.x + dx, this.y + dy);
    }
}

// Representing a player's turn and a method to get opponent's turn
class Turn {
    static WHITE = new Turn('W');
    static BLACK = new Turn('B');

    constructor(piece) {
        this.piece = piece;
    }

    getOpponentTurn() {
        return this == Turn.WHITE ? Turn.BLACK : Turn.WHITE;
    }
}

// Represents the Game State
class BoardState {
    constructor(turn, blackScore, whiteScore, board, tipMove) {
        this.turn = turn;
        this.blackScore = blackScore;
        this.whiteScore = whiteScore;
        // Deep copy array
        this.board = board.map(row => [...row]);
        this.tipMove = tipMove;
    }
}



//=============================
// Constants
//=============================
const BOARD_SIZE = 8;
const MINIMAX_DEPTH = 3;
const DIRS = [
    new Vector2(-1, 0),
    new Vector2(0, 1),
    new Vector2(1, 0),
    new Vector2(0, -1),
    new Vector2(-1, -1),
    new Vector2(-1, 1),
    new Vector2(1, 1),
    new Vector2(1, -1)
];


//=============================
// Logic
//=============================
function getInitialGameState() {
    return new BoardState(
        Turn.BLACK,
        2, 2,
        [
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', 'B', 'W', '', '', ''],
            ['', '', '', 'W', 'B', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', '']
        ],
        null
    );
}

function isOccupied(board, vector2) {
    return board[vector2.x][vector2.y] != '';
}

function isOutOfBound(vector2) {
    return vector2.x < 0 || vector2.x >= BOARD_SIZE || vector2.y < 0 || vector2.y >= BOARD_SIZE;
}

function getScore(board) {
    let blackScore = 0;
    let whiteScore = 0;

    for (let x = 0; x < BOARD_SIZE; x++) {
        for (let y = 0; y < BOARD_SIZE; y++) {
            if (board[x][y] == Turn.BLACK.piece) blackScore++;
            if (board[x][y] == Turn.WHITE.piece) whiteScore++;
        }
    }
    
    return { blackScore, whiteScore };
}

// Returns a list of Vector2 that can be put for the given board and turn. 
// If there is no available move, returns empty array
function getAvailableMoves(board, turn) {
    const availableMoves = [];

    for (let x = 0; x < BOARD_SIZE; x++) {
        for (let y = 0; y < BOARD_SIZE; y++) {
            const vector2 = new Vector2(x, y);
            if (isAppropriateMove(board, turn, vector2)) availableMoves.push(vector2);
        }
    }
    return availableMoves;
}

// Returns boolean whether the move is appropriate moves for the given board, turn, and vector2
function isAppropriateMove(board, turn, vector2) {
    for (const direction of DIRS) {
        if (isAppropriateMoveInDirection(board, turn, vector2, direction)) return true;
    }
    return false;
}

// Returns boolean whether the move is appropriate or not for the given board, turn, vector2 and direction
function isAppropriateMoveInDirection(board, turn, vector2, direction) {
    const playerPiece = turn.piece;
    const opponentPiece = turn.getOpponentTurn().piece;

    if (isOccupied(board, vector2)) return false;

    let isFoundOpponentPiece = false;

    while (!isOutOfBound(vector2.move(direction.x, direction.y))) {
        vector2 = vector2.move(direction.x, direction.y);

        if (board[vector2.x][vector2.y] == opponentPiece) {
            isFoundOpponentPiece = true;
        } else if (board[vector2.x][vector2.y] == playerPiece) {
            return isFoundOpponentPiece;
        } else {
            return false;
        }
    }
    return false;
}

// Place piece and flip opponent's piece. Returns the new board after placing the piece
function placePiece(oldboard, turn, vector2) {
    const playerPiece = turn.piece;
    const opponentPiece = turn.getOpponentTurn().piece;

    const newBoard = oldboard.map(row => [...row]);
    newBoard[vector2.x][vector2.y] = playerPiece;

    for (const direction of DIRS) {
        let current = new Vector2(vector2.x, vector2.y);
        let isFoundOpponentPiece = false;

        while (!isOutOfBound(current.move(direction.x, direction.y))) {
            current = current.move(direction.x, direction.y);

            // Found opponent's piece. Set the boolean flag
            if (oldboard[current.x][current.y] === opponentPiece) {
                isFoundOpponentPiece = true;
            } 
            // Found player's piece. Flip opponent's piece
            else if (oldboard[current.x][current.y] === playerPiece) {
                if (!isFoundOpponentPiece) break;

                let x = current.x - direction.x, y = current.y - direction.y;

                while (oldboard[x][y] == opponentPiece) {
                    newBoard[x][y] = playerPiece;
                    x -= direction.x;
                    y -= direction.y;
                }
                break;
            } 
            // Found empty space. Break
            else break;
        }
    }
    return newBoard;
}


//=============================
// Minimax
//=============================
// Recursive. Evaluates the board for the given turn. Returns the heuristic score of the board for each player
function evaluateBoard(board, turn, layer = 0) {
    const availableMoves = getAvailableMoves(board, turn);
    if (availableMoves.length == 0 || layer >= MINIMAX_DEPTH) return getScore(board);

    let totalWhiteScore = 0, totalBlackScore = 0;

    availableMoves.forEach((move)=> {
        const newBoard = placePiece(board, turn, move);
        const { blackScore, whiteScore } = evaluateBoard(newBoard, turn.getOpponentTurn(), layer + 1);
        totalBlackScore += blackScore;
        totalWhiteScore += whiteScore;
    });

    return {
        blackScore: totalBlackScore / availableMoves.length, 
        whiteScore: totalWhiteScore / availableMoves.length
    };
}


function getBestMove(board, turn) {
    const availableMoves = getAvailableMoves(board, turn);
    let bestScore = -Infinity;
    let bestMove = null;

    availableMoves.forEach((move)=> {
        const newBoard = placePiece(board, turn, move);
        const { blackScore, whiteScore } = evaluateBoard(newBoard, turn.getOpponentTurn());
        const score = turn === Turn.BLACK ? blackScore : whiteScore;

        if (score > bestScore) {
            bestScore = score;
            bestMove = move;
        }
    });

    return bestMove;
}






//=============================
// Vue
//=============================

// Load vue after DOM is ready
document.addEventListener('DOMContentLoaded', function () {

const app = new Vue({
    el: '#app',
    data: {
        state: getInitialGameState(),
        availableMoves: [],
        history: [],
        mode: "VS",
    },
    mounted() {
        this.reset();
    },
    methods: {
        toggleMode() {
            this.mode = this.mode === "VS" ? "AI" : "VS";
            this.reset();
        },
        async click(row, col) {
            
            const vector2 = new Vector2(row, col);

            // Check selected slot is empty
            if (isOccupied(this.state.board, vector2)) return alert("Please select empty slot.");

            // Check selected slot is an available move
            if (!this.isAnAvailableMove(row, col)) return alert("Invalid move.");

            // If not AI, push to history to be able to undo
            if (this.mode !== "AI" || this.state.turn !== Turn.WHITE) this.addHistory();

            // Get new board after putting piece and flipping over opponent's piece
            this.state.board = placePiece(this.state.board, this.state.turn, vector2);

            // Update score
            const { blackScore, whiteScore } = getScore(this.state.board);
            this.state.blackScore = blackScore;
            this.state.whiteScore = whiteScore;


            const opponentAvailableMoves = getAvailableMoves(this.state.board, this.state.turn.getOpponentTurn());
            
            // If the opponent has no available move, check if the player has available move.
            if (opponentAvailableMoves.length == 0) {
                const playerAvailableMoves = getAvailableMoves(this.state.board, this.state.turn);
                
                // If the player has no available move, the game is over and we can conclude the game.
                if (playerAvailableMoves.length == 0) {
                    if (this.state.blackScore == this.state.whiteScore) return alert("Draw!");
                    else if (this.state.blackScore > this.state.whiteScore) return alert("Black wins!");
                    else return alert("White wins!");
                } 
                // If the player has available move, the game continues with player.
                else {
                    this.availableMoves = playerAvailableMoves;
                }
            } 
            // If the opponent has available move, the game continues with opponent.
            else {
                this.state.turn = this.state.turn.getOpponentTurn();
                this.availableMoves = opponentAvailableMoves;
            }

            if (this.mode == "AI" && this.state.turn === Turn.WHITE) {
                await new Promise(resolve => setTimeout(resolve, 1000));
                const { x, y } = this.getAIMove();
                this.click(x, y);
            } else {
                this.state.tipMove = getBestMove(this.state.board, this.state.turn);
            }
        },
        isAnAvailableMove(row, col) {
            const vector2 = new Vector2(row, col);
            return this.availableMoves.some(move => move.x == vector2.x && move.y == vector2.y);
        },
        addHistory() {
            this.history.push(new BoardState( 
                this.state.turn,
                this.state.blackScore,
                this.state.whiteScore,
                this.state.board
            ));
        },
        undo() {
            if (this.history.length == 0) return;
            this.state = this.history.pop();
            this.availableMoves = getAvailableMoves(this.state.board, this.state.turn);
        },
        reset() {
            this.state = getInitialGameState();
            this.history = [];
            this.availableMoves = getAvailableMoves(this.state.board, this.state.turn);
        },
        getAIMove() {
            return getBestMove(this.state.board, this.state.turn);
        }
    }
});

});



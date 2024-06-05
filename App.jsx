import React, { Component } from 'react';

const initBoxes = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];

const players = {
  USER: "User",
  COMPUTER: "Computer",
};

const symbols = {
  User: "O",
  Computer: "X",
};

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      boxes: initBoxes,
      currentPlayer: null,
      winner: null,
      tossCompleted: false,
      showGame: false,
      computerTurn: false,
    };
    this.computerPlay = this.computerPlay.bind(this);
    this.tossCoin = this.tossCoin.bind(this);
    this.restartGame = this.restartGame.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.computerTurn !== this.state.computerTurn) {
      if (this.state.computerTurn) {
        setTimeout(this.computerPlay, 500); // Adding a small delay for better user experience
      }
    }
  }

  computerPlay() {
    const { boxes } = this.state;
    const { row, col } = this.findBestMove(boxes, players.COMPUTER);
    this.onSelectBox(row, col);
  }

  onSelectBox(outerIndex, innerIndex) {
    this.setState(({ boxes, currentPlayer }) => {
      if (boxes[outerIndex][innerIndex] !== "") return null; // Prevent selection on non-empty box

      const updatedBoxes = boxes.map((row, rIndex) =>
        row.map((cell, cIndex) =>
          rIndex === outerIndex && cIndex === innerIndex
            ? symbols[currentPlayer]
            : cell,
        ),
      );

      const winner = this.checkWinner(updatedBoxes);
      const nextPlayer =
        currentPlayer === players.USER ? players.COMPUTER : players.USER;

      return {
        boxes: updatedBoxes,
        currentPlayer: winner ? null : nextPlayer,
        winner,
        computerTurn: !winner && nextPlayer === players.COMPUTER,
      };
    });
  }

  checkWinner(boxes) {
    const lines = [
      // Rows
      [
        { r: 0, c: 0 },
        { r: 0, c: 1 },
        { r: 0, c: 2 },
      ],
      [
        { r: 1, c: 0 },
        { r: 1, c: 1 },
        { r: 1, c: 2 },
      ],
      [
        { r: 2, c: 0 },
        { r: 2, c: 1 },
        { r: 2, c: 2 },
      ],
      // Columns
      [
        { r: 0, c: 0 },
        { r: 1, c: 0 },
        { r: 2, c: 0 },
      ],
      [
        { r: 0, c: 1 },
        { r: 1, c: 1 },
        { r: 2, c: 1 },
      ],
      [
        { r: 0, c: 2 },
        { r: 1, c: 2 },
        { r: 2, c: 2 },
      ],
      // Diagonals
      [
        { r: 0, c: 0 },
        { r: 1, c: 1 },
        { r: 2, c: 2 },
      ],
      [
        { r: 0, c: 2 },
        { r: 1, c: 1 },
        { r: 2, c: 0 },
      ],
    ];

    for (const line of lines) {
      const [a, b, c] = line;
      if (
        boxes[a.r][a.c] &&
        boxes[a.r][a.c] === boxes[b.r][b.c] &&
        boxes[a.r][a.c] === boxes[c.r][c.c]
      ) {
        return boxes[a.r][a.c] === symbols.User
          ? players.USER
          : players.COMPUTER;
      }
    }

    if (boxes.every((row) => row.every((cell) => cell !== ""))) {
      return "Draw";
    }

    return null;
  }

  findBestMove(board, player) {
    const opponent = player === players.USER ? players.COMPUTER : players.USER;
    let bestMove = { row: -1, col: -1 };
    let bestValue = player === players.COMPUTER ? -Infinity : Infinity;

    const minimax = (board, depth, isMaximizing) => {
      const winner = this.checkWinner(board);
      if (winner) {
        if (winner === players.COMPUTER) return 10 - depth;
        if (winner === players.USER) return depth - 10;
        return 0;
      }

      if (isMaximizing) {
        let maxEval = -Infinity;
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            if (board[i][j] === "") {
              board[i][j] = symbols[players.COMPUTER];
              const evaluation = minimax(board, depth + 1, false);
              board[i][j] = "";
              maxEval = Math.max(maxEval, evaluation);
            }
          }
        }
        return maxEval;
      } else {
        let minEval = Infinity;
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            if (board[i][j] === "") {
              board[i][j] = symbols[players.USER];
              const evaluation = minimax(board, depth + 1, true);
              board[i][j] = "";
              minEval = Math.min(minEval, evaluation);
            }
          }
        }
        return minEval;
      }
    };

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] === "") {
          board[i][j] = symbols[player];
          const moveValue = minimax(board, 0, player === players.USER);
          board[i][j] = "";
          if (player === players.COMPUTER && moveValue > bestValue) {
            bestMove = { row: i, col: j };
            bestValue = moveValue;
          } else if (player === players.USER && moveValue < bestValue) {
            bestMove = { row: i, col: j };
            bestValue = moveValue;
          }
        }
      }
    }
    return bestMove;
  }

  tossCoin() {
    const firstPlayer = Math.random() < 0.5 ? players.USER : players.COMPUTER;
    this.setState({
      tossCompleted: true,
      showGame: true,
      currentPlayer: firstPlayer,
      computerTurn: firstPlayer === players.COMPUTER,
    });
  }

  restartGame() {
    this.setState({
      boxes: initBoxes,
      currentPlayer: null,
      winner: null,
      tossCompleted: false,
      showGame: false,
      computerTurn: false,
    });
  }

  renderSquare(outerIndex, innerIndex) {
    return (
      <button
        key={innerIndex}
        className="square"
        onClick={() =>
          this.state.currentPlayer === players.USER &&
          this.onSelectBox(outerIndex, innerIndex)
        }
      >
        {this.state.boxes[outerIndex][innerIndex]}
      </button>
    );
  }

  render() {
    const { tossCompleted, showGame, winner, boxes, currentPlayer } =
      this.state;
    const gameInProgress = boxes.some((row) => row.some((cell) => cell === ""));
    const status = winner
      ? winner === "Draw"
        ? "It's a Draw!"
        : `Winner: ${winner}`
      : `Next player: ${currentPlayer}`;

    return (
      <div className="game-container">
        <h1 className="game-title text-4xl mb-8">Tic Tac Toe Online Game</h1>
        {!tossCompleted && (
          <button className="toss-btn" onClick={this.tossCoin}>
            Toss Coin
          </button>
        )}
        {showGame && (
          <div>
            <div className="board">
              {boxes.map((row, outerIndex) => (
                <div key={outerIndex} className="row">
                  {row.map((_, innerIndex) =>
                    this.renderSquare(outerIndex, innerIndex),
                  )}
                </div>
              ))}
            </div>
            <div className="status">{status}</div>
            {(winner || !gameInProgress) && (
              <button className="restart-btn" onClick={this.restartGame}>
                Restart Game
              </button>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default Game;

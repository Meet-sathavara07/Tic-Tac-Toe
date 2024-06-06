export const initBoxes = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];
  
  export const players = {
    USER: "User",
    COMPUTER: "Computer",
  };
  
  export const symbols = {
    User: "O",
    Computer: "X",
  };
  
  export const checkWinner = (boxes) => {
    const lines = [
      // Rows
      [{ r: 0, c: 0 }, { r: 0, c: 1 }, { r: 0, c: 2 }],
      [{ r: 1, c: 0 }, { r: 1, c: 1 }, { r: 1, c: 2 }],
      [{ r: 2, c: 0 }, { r: 2, c: 1 }, { r: 2, c: 2 }],
      // Columns
      [{ r: 0, c: 0 }, { r: 1, c: 0 }, { r: 2, c: 0 }],
      [{ r: 0, c: 1 }, { r: 1, c: 1 }, { r: 2, c: 1 }],
      [{ r: 0, c: 2 }, { r: 1, c: 2 }, { r: 2, c: 2 }],
      // Diagonals
      [{ r: 0, c: 0 }, { r: 1, c: 1 }, { r: 2, c: 2 }],
      [{ r: 0, c: 2 }, { r: 1, c: 1 }, { r: 2, c: 0 }],
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
  };
  
  export const findBestMove = (board, player) => {
    const opponent = player === players.USER ? players.COMPUTER : players.USER;
    let bestMove = { row: -1, col: -1 };
    let bestValue = player === players.COMPUTER ? -Infinity : Infinity;
  
    const minimax = (board, depth, isMaximizing) => {
      const winner = checkWinner(board);
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
  };
  
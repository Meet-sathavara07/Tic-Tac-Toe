import React, { Component } from 'react';
import Board from './Board';
import ScoreBoard from './ScoreBoard';
import { initBoxes, players, symbols, findBestMove, checkWinner } from '../logic/gameLogic';
import '../../global.css';

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
      userWins: 0,
      computerWins: 0,
      draw: 0,
    };
    this.computerPlay = this.computerPlay.bind(this);
    this.tossCoin = this.tossCoin.bind(this);
    this.restartGame = this.restartGame.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.computerTurn !== this.state.computerTurn) {
      if (this.state.computerTurn) {
        setTimeout(this.computerPlay, 500);
      }
    }

    if (this.state.winner && prevState.winner !== this.state.winner) {
      if (this.state.winner === players.USER) {
        this.setState((prevState) => ({ userWins: prevState.userWins + 1 }));
      } else if (this.state.winner === players.COMPUTER) {
        this.setState((prevState) => ({ computerWins: prevState.computerWins + 1 }));
      } else {
        this.setState((prevState) => ({ draw: prevState.draw + 1 }));
      }

      setTimeout(this.restartGame, 1500);
    }
  }

  computerPlay() {
    const { boxes } = this.state;
    const { row, col } = findBestMove(boxes, players.COMPUTER);
    this.onSelectBox(row, col);
  }

  onSelectBox(outerIndex, innerIndex) {
    this.setState(({ boxes, currentPlayer }) => {
      if (boxes[outerIndex][innerIndex] !== "") return null;

      const updatedBoxes = boxes.map((row, rIndex) =>
        row.map((cell, cIndex) =>
          rIndex === outerIndex && cIndex === innerIndex
            ? symbols[currentPlayer]
            : cell,
        ),
      );

      const winner = checkWinner(updatedBoxes);
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
    const { currentPlayer } = this.state;

  // Determine the next player for the next round based on the round number
  const roundNumber = this.state.userWins + this.state.computerWins + this.state.draw ;
  const nextPlayer = roundNumber % 2 === 1 ? players.USER : players.COMPUTER;

  this.setState({
    boxes: initBoxes,
    currentPlayer: nextPlayer,
    winner: null,
    tossCompleted: true, // Skip the coin toss for the next round
    computerTurn: nextPlayer === players.COMPUTER,
  });
}

  render() {
    const { tossCompleted, showGame, winner, boxes, currentPlayer, userWins, computerWins, draw } = this.state;
    const gameInProgress = boxes.some((row) => row.some((cell) => cell === ""));
    const status = winner
      ? winner === "Draw"
        ? "It's a Draw!"
        : `Winner: ${winner}`
      : `Next player: ${currentPlayer}`;

    return (
      <div className="game-container">
        <h1 className="game-title ">Tic Tac Toe Online Game</h1>
        <ScoreBoard userWins={userWins} computerWins={computerWins} draw={draw} />
        {!tossCompleted && (
          <button className="toss-btn" onClick={this.tossCoin}>
            Toss Coin
          </button>
        )}
        {showGame && (
          <div>
            <Board
              boxes={boxes}
              onSelectBox={(outerIndex, innerIndex) =>
                this.onSelectBox(outerIndex, innerIndex)
              }
              currentPlayer={currentPlayer}
            />
            <div className="status">{status}</div>
          </div>
        )}
      </div>
    );
  }
}

export default Game;

import React, { Component } from 'react';
import Board from './Board';
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
    this.setState({
      boxes: initBoxes,
      currentPlayer: null,
      winner: null,
      tossCompleted: false,
      showGame: false,
      computerTurn: false,
    });
  }

  render() {
    const { tossCompleted, showGame, winner, boxes, currentPlayer } = this.state;
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
          <button className="restart-btn" onClick={this.tossCoin}>
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

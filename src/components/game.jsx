import React, { Component } from 'react';
import Board from './Board';
import ScoreBoard from './ScoreBoard';
import { initBoxes, players, symbols, findBestMove, checkWinner } from '../logic/gameLogic';
import '../global.css';

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
      draws: 0,
    };
    this.computerPlay = this.computerPlay.bind(this);
    this.tossCoin = this.tossCoin.bind(this);
    this.restartGame = this.restartGame.bind(this);
    this.handleScreenClick = this.handleScreenClick.bind(this);
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
        this.setState((prevState) => ({
          computerWins: prevState.computerWins + 1,
        }));
      } else if (this.state.winner === 'Draw') {
        this.setState((prevState) => ({ draws: prevState.draws + 1 }));
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
      if (boxes[outerIndex][innerIndex] !== '') return null;

      const updatedBoxes = boxes.map((row, rIndex) =>
        row.map((cell, cIndex) =>
          rIndex === outerIndex && cIndex === innerIndex ? symbols[currentPlayer] : cell,
        ),
      );

      const winner = checkWinner(updatedBoxes);
      const nextPlayer = currentPlayer === players.USER ? players.COMPUTER : players.USER;

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
    const { userWins, computerWins, draws } = this.state;
    const roundNumber = userWins + computerWins + draws + 1;
    const nextPlayer = roundNumber % 2 === 1 ? players.USER : players.COMPUTER;

    this.setState({
      boxes: initBoxes,
      currentPlayer: nextPlayer,
      winner: null,
      tossCompleted: true,
      computerTurn: nextPlayer === players.COMPUTER,
    });
  }

  handleScreenClick() {
    const { winner } = this.state;
    if (winner) {
      this.restartGame();
    }
  }

  render() {
    const { tossCompleted, showGame, winner, boxes, currentPlayer, userWins, computerWins, draws } =
      this.state;
    const gameInProgress = boxes.some((row) => row.some((cell) => cell === ''));
    const status = winner ? (
      winner === 'Draw' ? (
        <div>
          It's a Draw!
          <br />
          Click to restart.
        </div>
      ) : (
        <div>
          Winner: {winner}.<br />
          Click to restart.
        </div>
      )
    ) : (
      `Turn: ${currentPlayer}`
    );

    return (
      <div className="game-container" onClick={this.handleScreenClick}>
        <div className="header">
          <h1 className="game-title text-4xl mb-8">Tic Tac Toe Online Game</h1>
        </div>
        {showGame && <ScoreBoard userWins={userWins} computerWins={computerWins} draws={draws} />}
        {!tossCompleted && (
          <button className="toss-btn" onClick={this.tossCoin}>
            Toss Coin
          </button>
        )}
        {showGame && (
          <div>
            <Board
              boxes={boxes}
              onSelectBox={(outerIndex, innerIndex) => this.onSelectBox(outerIndex, innerIndex)}
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

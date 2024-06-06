import React from 'react';
import '../../global.css';

const ScoreBoard = ({ userWins, computerWins, draw }) => {
  return (
    <div className="scoreboard">
      <div className="score">
        <span>User: </span>
        <span>{userWins}</span>
      </div>
      <div className="score">
        <span>Draws: </span>
        <span>{draw}</span>
      </div>
      <div className="score">
        <span>Computer: </span>
        <span>{computerWins}</span>
      </div>
     
    </div>
  );
};

export default ScoreBoard;

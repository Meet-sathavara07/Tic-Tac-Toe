import React from 'react';
import '../global.css';

const ScoreBoard = ({ userWins, computerWins, draws }) => {
  return (
    <div className="scoreboard">
      <div className="score">
        <span>User : </span>
        <span>{userWins}</span>
      </div>
      <div className="score">
        <span>Draw : </span>
        <span>{draws}</span>
      </div>

      <div className="score">
        <span>Computer : </span>
        <span>{computerWins}</span>
      </div>
    </div>
  );
};

export default ScoreBoard;

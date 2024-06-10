import React from 'react';
import Square from './Square';
import '../global.css';

const Board = ({ boxes, onSelectBox, currentPlayer }) => {
  return (
    <div className="board">
      {boxes.map((row, outerIndex) => (
        <div key={outerIndex} className="row">
          {row.map((_, innerIndex) => (
            <Square
              key={innerIndex}
              value={boxes[outerIndex][innerIndex]}
              onClick={() => currentPlayer === 'User' && onSelectBox(outerIndex, innerIndex)}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Board;

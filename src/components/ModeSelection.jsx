import React from 'react';

const ModeSelection = ({ onSelectMode }) => (
  <div className="mode-selection">
    <h1>Select Game Mode</h1>
    <button onClick={() => onSelectMode('single')}>Single Player</button>
    <button onClick={() => onSelectMode('multi')}>Two Player</button>
  </div>
);

export default ModeSelection;

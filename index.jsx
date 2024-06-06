import { createRoot } from 'react-dom/client';
import App from './App';
import './global.css';

const container = document.getElementById('root');
const root = createRoot(container);

 root.render(<App />);


// import React from 'react';
// import ReactDOM from 'react-dom';
// import './global.css'; // You can create a global CSS file if needed
// import App from './App';

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );

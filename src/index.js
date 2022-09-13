import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import CrosschainRouter from './router-pages/Router/CrosschainRouter';

// import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <CrosschainRouter />
  </React.StrictMode>
);

// reportWebVitals();
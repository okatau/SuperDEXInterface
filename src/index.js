import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './tsm-pages/Mint/App';
import Valve from './tsm-pages/Valve/Valve';
import Freezer from './tsm-pages/Freezer/Freezer';
import CrosschainRouter from './router-pages/Router/CrosschainRouter';
import Uniswap from './router-pages/Uniswap/Uniswap';

import {BrowserRouter as Router, Switch , Route, Routes, Link} from 'react-router-dom';
// import {HashRouter as Router, Switch , Route, Routes, Link} from 'react-router-dom';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
<Router>
    <Routes>
{/* TSM */}
      <Route path="/tsm" element={<App />} />
      <Route path= "/valve" element={<Valve />} />
      <Route path= "/freezer" element={<Freezer />} />
{/* Router */}
<Route path="/router" element={<CrosschainRouter />} />
<Route path="/uniswap" element={<Uniswap />} />

    </Routes>
  </Router>
);
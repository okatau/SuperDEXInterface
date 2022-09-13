import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import CrosschainRouter from './router-pages/Router/CrosschainRouter';

import {BrowserRouter as Router, Switch , Route, Routes, Link} from 'react-router-dom';
// import {HashRouter as Router, Switch , Route, Routes, Link} from 'react-router-dom';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
<Router>
    <Routes>
      <Route path="/router" element={<CrosschainRouter />} />
    </Routes>
  </Router>
);
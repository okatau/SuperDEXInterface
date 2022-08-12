import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './pages/Mint/App';
import Faucet from './pages/Reg/Faucet';
import {BrowserRouter as Router, Switch , Route, Routes, Link} from 'react-router-dom';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
<Router>
    <Routes>
      <Route path="web-tsm/" element={<App />} />
      <Route path="web-tsm/tsm" element={<App />} />
      <Route path= "web-tsm/faucet" element={<Faucet />} />
    </Routes>
  </Router>
);

// export default index;
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './pages/Mint/App';
import Faucet from './pages/Valve/Faucet';
import Freezer from './pages/Freezer/Freezer';
import TestMetaMask from './pages/TestMetaMask/TestMetaMask';
import {HashRouter as Router, Switch , Route, Routes, Link} from 'react-router-dom';
// import {BrowserRouter as Router, Switch , Route, Routes, Link} from 'react-router-dom';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
<Router>
    <Routes>
      {/* <Route path="web-tsm/" element={<App />} /> */}
      <Route path="/tsm" element={<App />} />
      <Route path= "/valve" element={<Faucet />} />
      <Route path= "/freezer" element={<Freezer />} />
      <Route path= "/testmm" element={<TestMetaMask />} />
    </Routes>
  </Router>
);

// export default index;
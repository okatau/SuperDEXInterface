import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './pages/Mint/App';
import Reg from './pages/Reg/Reg';
import {BrowserRouter as Router, Switch , Route, Routes, Link} from 'react-router-dom';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
<Router>
    <Routes>
      <Route path="web-tsm/" element={<App />} />
      <Route path= "web-tsm/registration" element={<Reg />} />
    </Routes>
  </Router>
);

// export default index;
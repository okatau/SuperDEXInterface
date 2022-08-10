import{ useState } from 'react';
import './App.css';
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';
import MainMint from './MainMint';
import NavBar from './NavBar';


function App() {
  const [accounts, setAccounts] = useState([]);

  return (
    <div className="overlay">
      <div className="App">  
        <NavBar accounts={accounts} setAccounts={setAccounts} />
        <MainMint accounts={accounts} setAccounts={setAccounts} />
        <div className="moving-background"> </div>
      </div>
    </div>
  );
}


export default App;
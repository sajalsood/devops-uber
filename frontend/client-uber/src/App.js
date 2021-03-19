import React, { useState } from 'react';
import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Dashboard from './components/dashboard';
import Login from './components/login';


function App() {

  const [token, setToken] = useState();

  if(!token) {
    return <Login setToken={setToken} />
  }
  
  return (
    <div className="App">
      <header className="App-header">Devops UBER</header>
      <BrowserRouter>
        <Switch>
          <Route path="/dashboard">
            <Dashboard />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;

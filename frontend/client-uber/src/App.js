import React, { useState } from 'react';
import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Dashboard from './components/dashboard';
import Login from './components/login';
import Session from './services/session';

function App() {
  const { user, setUser, clearSession } = Session();

  if(!user) {
    return (
      <div className="App">
        <header className="App-header">
          <div className="App-heading">Devops UBER</div>
        </header>
        <Login setUser={setUser} />
      </div>
    )
  }
  
  return (
    <div className="App">
      <header className="App-header">
        <div className="App-user">Welcome, {user.username}</div>
        <div className="App-heading">Devops UBER</div>
        <button className="App-logout" onClick={e => clearSession()}>Logout</button>
      </header>
      <BrowserRouter>
        <Switch>
          <Route exact path="/">
            <Dashboard user={user}/>
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;

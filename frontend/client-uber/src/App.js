import React, { useState } from 'react';
import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Dashboard from './components/dashboard';
import Login from './components/login';
import Session from './services/session';

function App() {
  const { user, setUser } = Session();

  if(!user) {
    return (
      <div className="App">
        <header className="App-header">Devops UBER</header>
        <Login setUser={setUser} />
      </div>
    )
  }
  
  return (
    <div className="App">
      <header className="App-header">Devops UBER</header>
      <BrowserRouter>
        <Switch>
          <Route exact path="/">
            <Dashboard />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;

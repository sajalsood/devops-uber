import React, { useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import "./App.css";

import Dashboard from './components/dashboard';
import Bookings from './components/bookings';
import Login from './components/login';
import Session from './services/session';
import {
  Container,
  Collapse,
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  NavbarText,
  Button
} from 'reactstrap';

function App() {
  const { user, setUser, clearSession } = Session();

  if(!user) {
    return (
      <div>
        <Navbar color="dark" dark expand="md">
          <NavbarBrand href="/">DevopsUBER</NavbarBrand>
        </Navbar>
        <div className="App">
            <Login setUser={setUser} />
        </div>
    </div>
    )
  }
  
  return (
    <div>
        <Navbar color="dark" dark expand="md">
          <NavbarBrand href="/">DevopsUBER</NavbarBrand>
          <Collapse navbar>
            <Nav className="mr-auto" navbar>
              <NavItem>
                <NavLink href="/">Dashboard</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/bookings">Bookings</NavLink>
              </NavItem>
            </Nav>
            <NavbarText>Hello, {user.username} &nbsp;&nbsp;&nbsp;</NavbarText>
            <Button color="danger" onClick={e => clearSession()}>Logout</Button>
          </Collapse>
        </Navbar>
        <div className="App">
          <BrowserRouter>
              <Switch>
                <Route exact path="/">
                  <Dashboard user={user}/>
                </Route>
                <Route path="/bookings">
                  <Bookings user={user}/>
                </Route>
              </Switch>
          </BrowserRouter>
        </div>
    </div>
  );
}

export default App;

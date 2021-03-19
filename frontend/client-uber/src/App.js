import React, { useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Dashboard from './components/dashboard';
import Login from './components/login';
import Session from './services/session';
import {
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
        <Navbar color="light" light expand="md">
          <NavbarBrand href="/">DevopsUBER</NavbarBrand>
        </Navbar>
        <Login setUser={setUser} />
    </div>
    )
  }
  
  return (
    <div>
        <Navbar color="light" light expand="md">
          <NavbarBrand href="/">DevopsUBER</NavbarBrand>
          <Collapse navbar>
            <Nav className="mr-auto" navbar>
              <NavItem>
                <NavLink href="/">Dashboard</NavLink>
              </NavItem>
            </Nav>
            <NavbarText>Hello, {user.username} &nbsp;&nbsp;&nbsp;</NavbarText>
            <Button color="danger" onClick={e => clearSession()}>Logout</Button>
          </Collapse>
        </Navbar>
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

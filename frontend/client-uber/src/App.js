import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import "./App.css";
import Dashboard from './components/dashboard';
import Bookings from './components/bookings';
import Login from './components/login';
import Error from './components/error';
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
        <Navbar color="dark" dark expand="md">
          <NavbarBrand href="/">
            <div className="Logo">
              <small><strong>Uber Bus</strong></small>
            </div>
          </NavbarBrand>
        </Navbar>
        <div className="App">
          <BrowserRouter>
              <Switch>
                <Route exact path="/">
                  <Login setUser={setUser} />
                </Route>
                <Route path="">
                  <Error />
                </Route>
              </Switch>
            </BrowserRouter>
        </div>
    </div>
    )
  }
  
  return (
    <div>
        <Navbar color="dark" dark expand="md">
          <NavbarBrand href="/">
            <div className="Logo">
              <small><strong>Uber Bus</strong></small>
            </div>
          </NavbarBrand>
          <Collapse navbar>
            <Nav className="mr-auto" navbar>
              <NavItem>
                <NavLink href="/">Dashboard</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/bookings">Bookings</NavLink>
              </NavItem>
            </Nav>
            <NavbarText>Hello there, {user.user_name} &nbsp;&nbsp;&nbsp;</NavbarText>
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
                <Route path="">
                  <Error/>
                </Route>
              </Switch>
          </BrowserRouter>
        </div>
    </div>
  );
}

export default App;

import React from 'react';
import {Container} from 'reactstrap';

export default function Bookings({user}) {
  console.log(user);

  return(
      <Container className="themed-container">
        <h3><center>Bookings for, { user.username }</center></h3>
      </Container>
  );
}
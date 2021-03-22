import React, { useState, useEffect } from 'react';
import { getBookings } from '../services/apis';
import {Container, Table, Alert} from 'reactstrap';

export default function Bookings({user}) {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    (async () => {
      const user_id = user.user_id;
      const data = await getBookings(user_id);
      const bookings = data.data;
      setBookings(bookings);
    })();
  });

  if(bookings.length === 0) {
    return(
      <Container className="Booking themed-container">
          <div style={{ textAlign: 'center'}}>
              <Alert color="info">You have not booked any rides. Go to dashboard and book a ride now!</Alert>
          </div>
      </Container>
    )
  }

  return(
     
      <Container className="Booking themed-container">
        <h3><center>See Your Rides</center></h3>
          <Table className="mg-3" striped>
            <thead>
              <tr>
                <th>Booking #</th>
                <th>Source</th>
                <th>Destination</th>
                <th>Date Time (YYYY-mm-DD H:mm)</th>
                <th>Bus</th>
                <th>Seats</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b, i) =>
                <tr>
                  <th scope="row">{i + 1}</th>
                  <td>{b.source}</td>
                  <td>{b.destination}</td>
                  <td>{b.booking_date} {b.booking_time}</td>
                  <td>{b.bus.bus_name}</td>
                  <td>{b.seats}</td>
                </tr>
              )}
        </tbody>
          </Table>
      </Container>
  );
}
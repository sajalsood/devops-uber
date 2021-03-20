import React, { useState, useEffect } from 'react';
import { getBookings } from '../services/apis';
import {Container, Table} from 'reactstrap';

export default function Bookings({user}) {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    (async () => {
      const user_id = user.user_id;
      const data = await getBookings(user_id);
      const bookings = data.data;
      setBookings(bookings);
    })();
  }, []);


  return(
      <Container className="themed-container">
        <h3><center>Check Your Bookings!</center></h3>
          <Table className="mg-3" striped>
            <thead>
              <tr>
                <th>Booking #</th>
                <th>Source</th>
                <th>Destination</th>
                <th>On</th>
                <th>Bus</th>
                <th>Seats</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(b =>
                <tr>
                  <th scope="row">{b.booking_id}</th>
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
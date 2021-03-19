import React, { useState, useEffect } from 'react';
import { login } from '../services/apis';
import {Container, Table} from 'reactstrap';

export default function Bookings({user}) {
  console.log(user);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    (async () => {
      // const bookings = await bookings({
      //   username,
      //   password
      // });

      const bookings = [{
        booking_id: 1,
        source: 'newton',
        destination: 'boston',
        booking_date: "03/21/2021",
        booking_time: "14:23",
        bus_id: 2222,
        seats: 21
      },
      {
        booking_id: 2,
        source: 'newton',
        destination: 'boston',
        booking_date: "03/21/2021",
        booking_time: "14:23",
        bus_id: 2222,
        seats: 21
      },
      {
        booking_id: 3,
        source: 'newton',
        destination: 'boston',
        booking_date: "03/21/2021",
        booking_time: "14:23",
        bus_id: 2222,
        seats: 21
      },
      {
        booking_id: 4,
        source: 'newton',
        destination: 'boston',
        booking_date: "03/21/2021",
        booking_time: "14:23",
        bus_id: 2222,
        seats: 21
      },
      {
        booking_id: 5,
        source: 'newton',
        destination: 'boston',
        booking_date: "03/21/2021",
        booking_time: "14:23",
        bus_id: 2222,
        seats: 21
      }];

      setBookings(bookings);

    })();
  }, []);


  return(
      <Container className="themed-container">
        <h3><center>Check Your Bookings!</center></h3>
          <Table className="mg-3" striped>
            <thead>
              <tr>
                <th>#</th>
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
                  <td>{b.bus_id}</td>
                  <td>{b.seats}</td>
                </tr>
              )}
        </tbody>
          </Table>
      </Container>
  );
}
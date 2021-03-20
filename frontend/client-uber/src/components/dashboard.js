import React, { useState, useEffect} from 'react';
import { getBuses, createBooking } from '../services/apis';
import { Container, Button, Form, FormGroup, Label, Input } from 'reactstrap';

export default function Dashboard({user}) {
  const today_date = new Date().toISOString().substr(0,10);
  const [buses, setBuses] = useState([]);
  const [source, setSource] = useState();
  const [destination, setDestination] = useState();
  const [booking_date, setBookingDate] = useState(today_date);
  const [booking_time, setBookingTime] = useState("08:00");
  const [bus_id, setBus] = useState();
  const [seats, setSeats] = useState();

  useEffect(() => {
    (async () => {
      const buses = await getBuses();
      setBuses(buses.data);
    })();
  },[]);

  const handleSubmit = async(e)=> {
    e.preventDefault();
    const user_id = user.user_id;
    console.log({source, destination, booking_date, booking_time, bus_id, seats, user_id});
    const booking = await createBooking({source, destination, booking_date, booking_time, bus_id, seats, user_id});

    if(booking.data.booking_id) {
      alert(`Booking created - ${booking.data.booking_id}`);
    }
  }

  return(
      <Container className="themed-container">
        <h3><center>Book A Bus Ride!</center></h3>
        <Form onSubmit={handleSubmit} className="mg-3">
            <FormGroup>
                <Label for="source">Source</Label>
                <Input type="text" name="source" placeholder="Enter Source" onChange={e => setSource(e.target.value)} required/>
            </FormGroup>
            <FormGroup>
                <Label for="destination">Destination</Label>
                <Input type="text" name="destination"  placeholder="Enter Destination" onChange={e => setDestination(e.target.value)} required/>
            </FormGroup>
            <FormGroup>
                <Label for="bookingdate">Date</Label>
                <Input type="date" name="bookingdate" placeholder="Enter Booking Date" defaultValue={today_date} onChange={e => setBookingDate(e.target.value)} required/>
            </FormGroup>
            <FormGroup>
                <Label for="booktime">Date</Label>
                <Input type="time" name="bookingtime" placeholder="Enter Booking Time"  defaultValue="08:00" onChange={e => setBookingTime(e.target.value)} required/>
            </FormGroup>
            <FormGroup>
              <Label for="bus">Bus</Label>
              <Input type="select" name="bus" onChange={e => setBus(e.target.value)} required>
                <option value="">Select</option>
                {buses.map(b =>
                  <option key={b.bus_id} value={b.bus_id}>{b.bus_name}</option>
                )}
              </Input>
            </FormGroup>
            <FormGroup>
                <Label for="seats">Seats</Label>
                <Input type="number" name="seats" placeholder="Enter Seats" onChange={e => setSeats(e.target.value)} required/>
            </FormGroup>
            <Button color="primary" type="submit">Submit</Button>
        </Form>
      </Container>
  );
}
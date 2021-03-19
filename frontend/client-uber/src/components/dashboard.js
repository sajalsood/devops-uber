import React, { useState } from 'react';
import { login } from '../services/apis';
import { Container, Button, Form, FormGroup, Label, Input } from 'reactstrap';

export default function Dashboard({user}) {
  // console.log(user);

  const [source, setSource] = useState();
  const [destination, setDestination] = useState();
  const [booking_date, setBookingDate] = useState();
  const [booking_time, setBookingTime] = useState();
  const [bus_id, setBus] = useState();
  const [seats, setSeats] = useState();

  const handleSubmit = async e => {
    e.preventDefault();
    console.log({source, destination, booking_date, booking_time, bus_id,  seats});
    // const user = await login({
    //   username,
    //   password
    // });
    // const user = {
    //     userid: 1, 
    //     username
    // }
    // setUser(user);
  }

  return(
      <Container className="themed-container">
        <h3><center>Book A Bus Ride!</center></h3>
        <Form onSubmit={handleSubmit}>
            <FormGroup>
                <Label for="source">Source</Label>
                <Input type="text" name="source" placeholder="Enter Source" onChange={e => setSource(e.target.value)} />
            </FormGroup>
            <FormGroup>
                <Label for="destination">Destination</Label>
                <Input type="text" name="destination"  placeholder="Enter Destination" onChange={e => setDestination(e.target.value)}/>
            </FormGroup>
            <FormGroup>
                <Label for="bookingdate">Date</Label>
                <Input type="date" name="bookingdate" placeholder="Enter Booking Date" onChange={e => setBookingDate(e.target.value)}/>
            </FormGroup>
            <FormGroup>
                <Label for="bookingtime">Date</Label>
                <Input type="time" name="bookingtime" placeholder="Enter Booking Time" onChange={e => setBookingTime(e.target.value)}/>
            </FormGroup>
            <FormGroup>
              <Label for="bus">Select Bus</Label>
              <Input type="select" name="bus" onChange={e => setBus(e.target.value)}>
                <option value="1">Bus 1</option>
                <option value="2">Bus 2</option>
                <option value="3">Bus 3</option>
                <option value="4">Bus 4</option>
              </Input>
            </FormGroup>
            <FormGroup>
                <Label for="seats">Seats</Label>
                <Input type="number" name="seats" placeholder="Enter Seats" onChange={e => setSeats(e.target.value)}/>
            </FormGroup>
            <Button color="primary" type="submit">Submit</Button>
        </Form>
      </Container>
  );
}
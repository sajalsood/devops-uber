import React, { useState, useEffect, useCallback} from 'react';
import { getBuses, createBooking } from '../services/apis';
import { Row, Col, Container, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { withScriptjs, withGoogleMap, GoogleMap, Marker, Polyline, lineSymbol } from "react-google-maps"
import Geocode from "react-geocode";
import {debounce} from 'lodash';

export default function Dashboard({user}) {
  Geocode.setApiKey("AIzaSyAX5Fiy_pu-e-mm1oqZpMZbh0akwOSe9HE");

  const today_date = new Date().toISOString().substr(0,10);
  const [buses, setBuses] = useState([]);
  const [source, setSource] = useState();
  const [source_cord, setSourceCoordiantes] = useState();
  const [destination, setDestination] = useState();
  const [destination_cord, setDestinationCoordiantes] = useState();
  const [marker_path, setMarkerPath] = useState([]);
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

  const sourceHandler = useCallback(debounce((e) => {
    Geocode.fromAddress(e).then(
      (response) => {
        setSource(e);
        setSourceCoordiantes(response.results[0].geometry.location);
        marker_path[0]=response.results[0].geometry.location;
        setMarkerPath(marker_path);
      },
      (error) => {
        console.error(error);
      }
    )
  }, 1000), []);

  const handleSourceMarker = (e)=> {
    setSourceCoordiantes("");
    sourceHandler(e);
  }

  const destinationHandler = useCallback(debounce((e) => {
    Geocode.fromAddress(e).then(
      (response) => {
        setDestination(e);
        setDestinationCoordiantes(response.results[0].geometry.location);
        marker_path[1]=response.results[0].geometry.location;
        setMarkerPath(marker_path);
      },
      (error) => {
        console.error(error);
      }
    )
  }, 1000), []);

  const handleDestinationMarker = (e)=> {
    setDestinationCoordiantes("");
    destinationHandler(e);
  }

  const MyMapComponent = withScriptjs(withGoogleMap(props =>
    <GoogleMap defaultZoom={10} defaultCenter={{ lat: 42.361145, lng: -71.057083 }}>
      { source_cord && <Marker position={source_cord}/> }
      { destination_cord && <Marker position={destination_cord}/> }

      { marker_path && <Polyline
                path={marker_path}
                geodesic={true}
                options={{
                    strokeColor: "#ff2527",
                    strokeOpacity: 0.75,
                    strokeWeight: 2,
                    icons: [
                        {
                            icon: lineSymbol,
                            offset: "0",
                            repeat: "20px"
                        }
                    ]
                }}
            />}
    </GoogleMap>
  ));

  return(
      <Container className="Dashboard themed-container">
        <div>
          <h3><center>Where are you going?</center></h3>
          <Form onSubmit={handleSubmit} className="mg-3">
            <FormGroup>
                <Label for="source">Source</Label>
                <Input type="text" name="source" placeholder="Source" onChange={e => handleSourceMarker(e.target.value)} required/>
            </FormGroup>
            <FormGroup>
                <Label for="destination">Destination</Label>
                <Input type="text" name="destination"  placeholder="Destination" onChange={e => handleDestinationMarker(e.target.value)} required/>
            </FormGroup>
            <Row form>
              <Col md={8}>
                <FormGroup>
                    <Label for="bookingdate">Date</Label>
                    <Input type="date" name="bookingdate" placeholder="Date" defaultValue={today_date} onChange={e => setBookingDate(e.target.value)} required/>
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                    <Label for="booktime">Time</Label>
                    <Input type="time" name="bookingtime" placeholder="Time"  defaultValue="08:00" onChange={e => setBookingTime(e.target.value)} required/>
                </FormGroup>
              </Col>
            </Row>
            <Row form>
              <Col md={8}>
                <FormGroup>
                  <Label for="bus">Bus</Label>
                  <Input type="select" name="bus" onChange={e => setBus(e.target.value)} required>
                    <option value="">Select</option>
                    {buses.map(b =>
                      <option key={b.bus_id} value={b.bus_id}>{b.bus_name}</option>
                    )}
                  </Input>
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label for="seats">Seats</Label>
                  <Input type="number" name="seats" placeholder="Seats" onChange={e => setSeats(e.target.value)} required/>
                </FormGroup>
              </Col>
            </Row>
            <Button color="primary" type="submit" style={{ width: '100%' }}>Book Your Ride</Button>
        </Form>
        </div>
        <div>
          <MyMapComponent 
            googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyAX5Fiy_pu-e-mm1oqZpMZbh0akwOSe9HE&v=3.exp&libraries=geometry,drawing,places"
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={<div style={{ height: `100%` }} />} 
            mapElement={<div style={{ height: `100%` }} />}/>
          </div>
      </Container>
  );
}
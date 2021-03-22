import React, { useState, useEffect, useCallback} from 'react';
import { getBuses, createBooking } from '../services/apis';
import { Row, Col, Container, Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import GoogleMapReact from 'google-map-react';
import Geocode from "react-geocode";
import {debounce} from 'lodash';

export default React.memo(function Dashboard({user}) {

  const today_date = new Date().toISOString().substr(0,10);
  const [buses, setBuses] = useState([]);
  const [source, setSource] = useState();
  const [destination, setDestination] = useState();
  const [source_lat, setSourceLat] = useState();
  const [source_lng, setSourceLng] = useState();
  const [dest_lat, setDestLat] = useState();
  const [dest_lng, setDestLng] = useState();
  const [marker_path, setMarkerPath] = useState([]);
  const [booking_date, setBookingDate] = useState(today_date);
  const [booking_time, setBookingTime] = useState("08:00");
  const [bus_id, setBus] = useState();
  const [seats, setSeats] = useState();
  const [google, setGoogleMap] = useState();
  const [flightPath, setFlightPath] = useState();
  const [alertVisible, setAlertVisible] = useState({isOpen : false, color: 'danger'});
  Geocode.setApiKey(process.env.REACT_APP_GOOGLE_MAPS_API);

  useEffect(() => {
    (async () => {
      const buses = await getBuses();
      setBuses(buses.data);
    })();
  },[]);


  const handleSubmit = async(e)=> {
    e.preventDefault();

    if(!source || !source.trim() || !destination || !destination.trim() || !bus_id || !seats || !booking_date || !booking_time){
      setAlertVisible({isOpen: true, color: 'danger', message: "Error! Please enter correct details."});
      return;
    }

    const user_id = user.user_id;
    const booking = await createBooking({source, destination, booking_date, booking_time, bus_id, seats, user_id});

    if(booking.data.booking_id) {
      setAlertVisible({isOpen: true, message: `Success! You ride has been booked.`});
    }
  }

  const sourceHandler = useCallback(debounce((e) => {
    Geocode.fromAddress(e).then(
      (response) => {
        const {lat, lng} = marker_path[0] = response.results[0].geometry.location;
        setSourceLat(lat);
        setSourceLng(lng);
        setMarkerPath(marker_path);
        if(marker_path.length > 1) {
          var flightPath = new google.maps.Polyline({
            path: marker_path,
            geodesic: true,
            strokeColor: 'red',
            strokeOpacity: 1,
            strokeWeight: 2
          });
    
          flightPath.setMap(google.map);
          setFlightPath(flightPath);
        }
      },
      (error) => {
        console.error(error);
      }
    )
  }, 1000), [google]);

  const handleSourceMarker = (src)=> {
    if(flightPath) {
      flightPath.setMap(null);
    }
    if(src) {
      sourceHandler(src);
    }
  }

  const destinationHandler = useCallback(debounce((e) => {
    Geocode.fromAddress(e).then(
      (response) => {
        const {lat, lng} = marker_path[1] = response.results[0].geometry.location;
        setDestLat(lat);
        setDestLng(lng);
        setMarkerPath(marker_path);
        if(marker_path.length > 1) {
          var flightPath = new google.maps.Polyline({
            path: marker_path,
            geodesic: true,
            strokeColor: 'red',
            strokeOpacity: 1,
            strokeWeight: 2
          });
    
          flightPath.setMap(google.map);
          setFlightPath(flightPath);
        }
      },
      (error) => {
        console.error(error);
      }
    )
  }, 1000), [google]);

  const handleDestinationMarker = (dest)=> {
    if(flightPath) {
      flightPath.setMap(null);
    }
    
    if(dest) {
      destinationHandler(dest);
    }
  }

  const MarkerComponent = ({text}) =>  {
    return (
      <div>
        <span className="pin-text">{text}</span>
        <div className="pin"></div>
      </div>
    )
  };

  return(
      <Container className="Dashboard themed-container">
        <div className="Dashboard-ride">
          <div>
            <Alert color={alertVisible.color} isOpen={alertVisible.isOpen}>{alertVisible.message}</Alert>
          </div>
          <h3><center>Where are you going?</center></h3>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
                <Label for="source">Source</Label>
                <Input type="text" name="source" placeholder="Source" onChange={e => { setAlertVisible({isOpen:false}); handleSourceMarker(e.target.value); setSource(e.target.value); }} />
            </FormGroup>
            <FormGroup>
                <Label for="destination">Destination</Label>
                <Input type="text" name="destination"  placeholder="Destination" onChange={e => { setAlertVisible({isOpen:false}); handleDestinationMarker(e.target.value); setDestination(e.target.value); }} />
            </FormGroup>
            <Row form>
              <Col md={6}>
                <FormGroup>
                    <Label for="bookingdate">Date</Label>
                    <Input type="date" name="bookingdate" placeholder="Date" min={today_date} defaultValue={today_date} onChange={e => { setAlertVisible({isOpen:false}); setBookingDate(e.target.value)}} />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                    <Label for="booktime">Time</Label>
                    <Input type="time" name="bookingtime" placeholder="Time"  defaultValue="08:00" onChange={e => { setAlertVisible({isOpen:false}); setBookingTime(e.target.value)}} />
                </FormGroup>
              </Col>
            </Row>
            <Row form>
              <Col md={6}>
                <FormGroup>
                  <Label for="bus">Bus</Label>
                  <Input type="select" name="bus" onChange={e => { setAlertVisible({isOpen:false}); setBus(e.target.value)}} >
                    <option value="">Select</option>
                    {buses.map(b =>
                      <option key={b.bus_id} value={b.bus_id}>{b.bus_name}</option>
                    )}
                  </Input>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="seats">Seats</Label>
                  <Input type="number" min="1" max="99" name="seats" placeholder="Seats" onChange={e => { setAlertVisible({isOpen:false}); setSeats(e.target.value)}} />
                </FormGroup>
              </Col>
            </Row>
            <Button color="primary" type="submit" style={{ width: '100%' }}>Book Your Ride</Button>
        </Form>
        </div>
      <div>  
        <GoogleMapReact
          bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAPS_API }}
          defaultCenter={{
            lat: 42.361145,
            lng: -71.057083
          }}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={(e) => setGoogleMap(e)}
          defaultZoom={10}>

          { source && source_lat && source_lng && <MarkerComponent lat={source_lat} lng={source_lng} text="S" /> }  
          { destination && dest_lat && dest_lng && <MarkerComponent lat={dest_lat} lng={dest_lng} text="D"/> }

        </GoogleMapReact>
      </div>  
      </Container>
  );
});


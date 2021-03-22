require('dotenv').config()

export const login = async(credentials) => {
  return fetch(`${process.env.REACT_APP_SERVER_API_BASE_URL}:${process.env.REACT_APP_SERVER_API_PORT}/api/v1/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  }).then(res => res.json())
}

export const getBuses = async() => {
  return fetch(`${process.env.REACT_APP_SERVER_API_BASE_URL}:${process.env.REACT_APP_SERVER_API_PORT}/api/v1/buses`, {
    method: 'GET'
  }).then(res => res.json())
}

export const createBooking = async(booking) => {
  return fetch(`${process.env.REACT_APP_SERVER_API_BASE_URL}:${process.env.REACT_APP_SERVER_API_PORT}/api/v1/booking`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(booking)
  }).then(res => res.json()).catch(err => console.log(err))
}

export const getBookings = async(user_id) => {
  return fetch(`${process.env.REACT_APP_SERVER_API_BASE_URL}:${process.env.REACT_APP_SERVER_API_PORT}/api/v1/bookings/${user_id}`, {
    method: 'GET'
  }).then(res => res.json())
}

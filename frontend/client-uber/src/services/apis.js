require('dotenv').config()

export const login = async(credentials) => {
  return fetch(`${process.env.REACT_APP_SERVER_API_BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  }).then(res => res.json())
}

export const getBuses = async() => {
  return fetch(`${process.env.REACT_APP_SERVER_API_BASE_URL}/buses`, {
    method: 'GET'
  }).then(res => res.json())
}

export const createBooking = async(booking) => {
  console.log(booking);
  return fetch(`${process.env.REACT_APP_SERVER_API_BASE_URL}/booking`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(booking)
  }).then(res => res.json())
}

export const getBookings = async(user_id) => {
  return fetch(`${process.env.REACT_APP_SERVER_API_BASE_URL}/bookings/${user_id}`, {
    method: 'GET'
  }).then(res => res.json())
}

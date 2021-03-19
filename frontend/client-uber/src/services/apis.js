require('dotenv').config()

export const login = async(credentials) => {
  return fetch(`${process.env.REACT_APP_SERVER_API_BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  }).then(data => data.json())
}

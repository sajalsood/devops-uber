import { useState } from 'react';

export default function Session() {
  const getSession = () => {
    const userString = sessionStorage.getItem('user');
    const user = JSON.parse(userString);
    return user?.username;
  };

  const [user, setUser] = useState(getSession());

  const saveSession = userSession => {
    sessionStorage.setItem('user', JSON.stringify(userSession));
    setUser(userSession.username);
  };

  return {
    setUser: saveSession,
    user
  }
}
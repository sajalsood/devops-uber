import React from 'react';

export default function Dashboard({user}) {
  console.log(user);

  return(
      <h2>Book a Bus, { user.username }</h2>
  );
}
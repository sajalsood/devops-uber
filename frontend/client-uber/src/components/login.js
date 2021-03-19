import React,  { useState } from 'react';
import { login } from '../services/apis';

export default function Login({setUser}) {
    const [username, setUserName] = useState();
    const [password, setPassword] = useState();

    const handleSubmit = async e => {
        e.preventDefault();
        // const user = await login({
        //   username,
        //   password
        // });
        setUser({ username });
    }

    return (
        <form onSubmit={handleSubmit}>
        <label>
            <p>Username</p>
            <input type="text" onChange={e => setUserName(e.target.value)}/>
        </label>
        <label>
            <p>Password</p>
            <input type="password" onChange={e => setPassword(e.target.value)}/>
        </label>
        <div>
            <button type="submit">Submit</button>
        </div>
        </form>
    )
}
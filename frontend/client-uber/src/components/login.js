import React,  { useState } from 'react';
import { login } from '../services/apis';
import { Container, Button, Form, FormGroup, Label, Input } from 'reactstrap';

export default function Login({setUser}) {
    const [username, setUserName] = useState();
    const [password, setPassword] = useState();

    const handleSubmit = async e => {
        e.preventDefault();
        // const user = await login({
        //   username,
        //   password
        // });

        const user = {
            userid: 1, 
            username
        }
        setUser(user);
    }

    return (
        <Container className="themed-container">
            <Form onSubmit={handleSubmit}>
                <FormGroup>
                    <Label for="username">Username</Label>
                    <Input type="text" name="username" placeholder="Enter Username" onChange={e => setUserName(e.target.value)} />
                </FormGroup>
                <FormGroup>
                    <Label for="password">Password</Label>
                    <Input type="password" name="password"  placeholder="Enter Password" onChange={e => setPassword(e.target.value)}/>
                </FormGroup>
                <Button color="primary" type="submit">Submit</Button>
            </Form>
        </Container>
    )
}
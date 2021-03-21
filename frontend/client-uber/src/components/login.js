import React,  { useState } from 'react';
import { login } from '../services/apis';
import { Container, Button, Form, FormGroup, Input,
    Card, CardImg, CardText, Alert,
    CardTitle } from 'reactstrap';

export default function Login({setUser}) {
    const [user_name, setUserName] = useState();
    const [password, setPassword] = useState();
    const [alertVisible, setAlertVisible] = useState(false);

    const handleSubmit = async(e) => {
        e.preventDefault();

        if(!user_name || !user_name.trim() || !password || !password.trim()){
            setAlertVisible(true);
            return;
        }
        const user = await login({
            user_name, password
        });
        setUser(user.data);
    }

    return (
        <Container className="Login themed-container" >
            <div>
                <Alert color="danger" isOpen={alertVisible}>Please enter username and password to continue.</Alert>
            </div>
            <Card body inverse style={{ backgroundColor: '#333', borderColor: '#333' }} className="text-center">
                <CardTitle tag="h2">USER LOGIN</CardTitle>
                <CardText tag="h4"></CardText>
                <CardImg top src={`${process.env.PUBLIC_URL}/login.png`} style={{ width: '65%', margin: '0 auto'}} alt="Welcome Login" />
                <CardText tag="h4"></CardText>
                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                        <Input type="text" name="username" placeholder="Enter Username" onChange={e => { setAlertVisible(false); setUserName(e.target.value) }} />
                    </FormGroup>
                    <FormGroup>
                        <Input type="password" name="password" placeholder="Enter Password" onChange={e => setPassword(e.target.value)}/>
                    </FormGroup>
                    <Button color="primary" type="submit" style={{ width: '100%' }}>LOGIN</Button>
                </Form>
            </Card>
        </Container>
    )
}
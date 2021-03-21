import React,  { useState } from 'react';
import { Container, Button, Form, FormGroup, Input,
    Card, CardImg, CardText, Alert,
    CardTitle } from 'reactstrap';

const backToHome = () => {
    window.location.href = "/";
}

export default function Error() {
    return (
        <Container className="Error themed-container" >
            <div></div>
            <Card body inverse color="warning" className="text-center">
                <CardTitle tag="h2">ERROR</CardTitle>
                <CardText tag="h4">404, Page not found</CardText>
                <CardImg top src={`${process.env.PUBLIC_URL}/bus.png`} style={{ width: '65%', margin: '0 auto'}} alt="Welcome Login" />
                <CardText tag="h4"></CardText>
                <Button color="primary" onClick={backToHome} style={{ width: '100%' }}>BACK TO HOME</Button>
            </Card>
        </Container>
    )
}
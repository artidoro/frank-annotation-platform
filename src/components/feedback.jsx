import React from 'react';
import { Container, Form, Button } from 'react-bootstrap';

const Feedback = (props) => {
    return (
        <Container>
            <Form onSubmit={props.onSubmit}>
                <Form.Group controlId="feedback">
                    {/* <Form.Label>We are developing the HIT, please provide feedback to help us improve it.</Form.Label>
                    <Form.Control required name='feedback' as="textarea" rows="3" onChange={props.handleChange}/> */}
                    <Form.Label>Feel free to provide any feedback to help improve the HIT. How can we make it better?</Form.Label>
                    <Form.Control name='feedback' as="textarea" rows="2" onChange={props.handleChange}/>
                </Form.Group>
                <Button type='submit'>Submit</Button>
            </Form>
        </Container>
    );
}

export default Feedback;
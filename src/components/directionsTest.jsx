import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const DirectionsTest = (props) => {
    return (
        <Container>
            <Row>
                <Col>
                    <Card className="mb-20" bg="warning">
                        <Card.Header>Directions</Card.Header>
                        <Card.Body>
                            <Card.Title> Did you understand the instructions?</Card.Title>
                            <Card.Text>
                                Before we move to the actual task we will quickly check you remember the instructions.
                                <br/>
                                We will provide explanations when you make a mistake.
                                <br/>
                                <b>NOTE: in future HITs you will skip this and move directly to the task.</b>
                            </Card.Text>
                            <Button onClick={() => { props.takeTest() }}>Take the test</Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default DirectionsTest;
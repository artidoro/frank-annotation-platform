import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const DirectionsMainTask = (props) => {
    return (
        <Container>
            <Row>
                <Col>
                    <Card className="mb-20" bg="warning">
                        {/* <Card.Header>Directions</Card.Header> */}
                        <Card.Body>
                            <Card.Title>Main Task Directions</Card.Title>
                            <Card.Text>
                                This is the beginning of the main task. You will have to do three things:
                                <ol>
                                    <li>Read the article <b>fully</b>.</li>
                                    <li>Answer a question about the article to verify that you read it (you will not have access to the article).</li>
                                    <li>Find any mistakes in the summaries and categorize them.</li>
                                </ol>
                            </Card.Text>
                            <Button onClick={() => { props.beginTask() }}>Begin main task</Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default DirectionsMainTask;
import React from 'react';
import { Form, FormGroup, Button, Card} from 'react-bootstrap';

const EntityQuestion = (props) => {
    return (
        <div className="mb-20">
            <Card>
                <Card.Body>
                    <h2>Question</h2>
                    <p> Which of the following <b>was not</b> mentioned in the article? </p>
                    <Form onSubmit={props.onSubmit}>
                        <FormGroup> {
                            props.entities.map((entity) => (
                                <Form.Check
                                    required
                                    type="radio"
                                    name="entityQuestion"
                                    key={entity}
                                    id={entity}
                                    label={entity}
                                    value={entity}
                                    onChange={props.handleChange}
                                />
                            ))}
                        </FormGroup>
                        <Button type='submit'>Next</Button>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    )
}

export default EntityQuestion;
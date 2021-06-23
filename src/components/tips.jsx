import React, { useState } from 'react';
import { Collapse, Card, Button } from 'react-bootstrap';

const Tips = (props) => {
    const [open, setOpen] = useState(false);

    return (
        <div className="mb-20 tips" id="tips">
            <div className="mb-20">
                <Button
                    variant='info'
                    size='sm'
                    onClick={() => setOpen(!open)}
                    aria-controls="tips"
                    aria-expanded={open}
                >
                    Tip: Unsure about which category?
                </Button>
            </div>
            <Collapse in={open}>
                <Card bg='info'>
                    <Card.Body >
                        <Card.Title>Tip: When unsure about which category</Card.Title>
                        <Card.Text>
                        Go over the examples in the instructions and find the most similar scenario. <br/>
                        Then try the following procedure IN ORDER and selecting all that apply:
                        <ol>
                            <li>Check if there is <b>information from outside the article</b>. Is everything in the sentence related to the article?</li>
                            <li>Just based on the summary:
                                <ol type='a'>
                                    <li>Is the sentence <b>grammatically meaningful?</b></li>
                                    <li>Are all <b>pronouns and referring expressions</b> used correctly?</li>
                                </ol>
                            </li>
                            <li>If the error is self contained to one fact/relation:
                                <ol type='a'>
                                    <li>Check if the <b>relation</b> is correct. Is what happened correct?</li>
                                    <li>Check if the <b>entities</b> are correct. Is the "who", "what", "to whom" correct?</li>
                                    <li>Check the <b>circumstantial</b> information, the "when", "how", etc.</li>
                                </ol>
                            </li>
                            <li>If the error is about the connection of two or more facts (even if in separate sentences) then it is a <b>logical or temporal link</b> error.</li>
                        </ol>
                        </Card.Text>
                    </Card.Body>
                </Card>
            </Collapse>
        </div>
    );
}

export default Tips;
import React from 'react';
import { Card, Button, Form, FormGroup, Container, Row, Col } from 'react-bootstrap';

import Tips from './tips';

const FactualityRadio = (props) => {
    return (
        <div>
            <p>
                Are the facts in the <span className="currentSentence">highlighted</span> sentence in the summary correct?
            </p>
            <FormGroup>
                <Form.Check
                    required
                    type="radio"
                    name={"factuality"}
                    key={"not-factual-"+props.id}
                    id={"not-factual-"+props.id}
                    label="Yes"
                    value="factual"
                    onChange={props.handleChange}
                />
                <Form.Check
                    required
                    type="radio"
                    name={"factuality"}
                    key={"factual-"+props.id}
                    id={"factual-"+props.id}
                    label="No"
                    value="not-factual"
                    onChange={props.handleChange}
                />
            </FormGroup>
        </div>
    )
}

const CategoryCheckbox = (props) => {
    const categories = [
        {label:'Information not in article: entity or relation were not mentioned in the text.', value:'f4'},
        {label:'Grammatically meaningless: very wrong grammar cannot be understood.', value:'f5'},
        {label:'Misuse of pronoun: wrong pronoun ("he", "she", etc.) or referring expression ("the former", etc.).', value:'f6'},
        {label:'Wrong relationship between entities: what happened is wrong (typically described by the verb).', value:'f1'},
        {label:'Wrong entities in the relation: the "who", "what", "to whom", etc. is wrong. Relationship appears in the text but with different entities.', value:'f2'},
        {label:'Wrong circumstance: wrong location, time, date, goal, manner, adverbs etc.', value:'f3'},
        {label:'Wrong relationship between facts: logical or temporal link of facts is wrong.', value:'f7'},
        {label:'Other', value:'f8'},
    ];
    if (!props.other) {
        return (
            <div>
                <p>
                    What kind of mistakes are present in the <span className="currentSentence">highlighted</span> sentence? Select all that apply.
                </p>
                <FormGroup>
                    {
                        categories.map((category) =>
                            <Form.Check
                                type="checkbox"
                                name={category.value+"-"+props.id}
                                key={category.value+"-"+props.id}
                                id={category.value+"-"+props.id}
                                label={category.label}
                                value={category.value}
                                feedback={props.feedback}
                                isInvalid={props.missingCategories}
                                onChange={props.handleChange}
                            />
                        )
                    }
                </FormGroup>
            </div>
        )
    } else {
        return (
            <div>
                <p>
                    What kind of mistakes are present in the <span className="currentSentence">highlighted</span> sentence? Select all that apply.
                </p>
                <FormGroup>
                    {
                        categories.map((category) =>
                            <Form.Check
                                type="checkbox"
                                name={category.value+"-"+props.id}
                                key={category.value+"-"+props.id}
                                id={category.value+"-"+props.id}
                                label={category.label}
                                value={category.value}
                                feedback={props.feedback}
                                isInvalid={props.missingCategories}
                                onChange={props.handleChange}
                            />
                        )
                    }
                </FormGroup>
                <FormGroup>
                    <Form.Label>Describe the error:</Form.Label>
                    <Form.Control required name='describe' as="textarea" rows="2" onChange={props.handleChange}/>
                </FormGroup>
            </div>
        )
    }
}

const FactualityQuestion = (props) => {
    if (props.factual)  {
        return (
            <div className='mb-20'>
                <h2>Question</h2>
                <Card>
                    <Card.Body>
                        <Form onSubmit={props.onSubmit}>
                            <FactualityRadio
                                handleChange={props.handleChange}
                                id={props.id}
                            />
                            <Container fluid>
                                <Row>
                                    <Col>
                                        <div className='text-left'>
                                            <Button variant="secondary" onClick={props.back}>Back</Button>
                                        </div>
                                    </Col>
                                    <Col>
                                        <div className='text-right'>
                                            <Button type='submit'>Next</Button>
                                        </div>
                                    </Col>
                                </Row>
                            </Container>
                        </Form>
                    </Card.Body>
                </Card>
            </div>
        )
    }
    else {
        return (
            <div className='mb-20'>
                <h2>Question</h2>
                <Card>
                    <Card.Body>
                        <Form onSubmit={props.onSubmit}>
                            <FactualityRadio
                                handleChange={props.handleChange}
                                id={props.id}
                            />
                            <Tips/>
                            <CategoryCheckbox
                                id={props.id}
                                missingCategories={props.missingCategories}
                                handleChange={props.handleChange}
                                feedback='Select at least one.'
                                other={props.other}
                            />
                            <Container fluid>
                                <Row>
                                    <Col>
                                        <div className='text-left'>
                                            <Button variant="secondary" onClick={props.back}>Back</Button>
                                        </div>
                                    </Col>
                                    <Col>
                                        <div className='text-right'>
                                            <Button type='submit'>Next</Button>
                                        </div>
                                    </Col>
                                </Row>
                            </Container>
                        </Form>
                    </Card.Body>
                </Card>
            </div>
        )
    }
}

export default FactualityQuestion;
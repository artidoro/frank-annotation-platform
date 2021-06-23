import React from 'react';
import { Container, Row, Col, Alert } from 'react-bootstrap';

import Article from "./article";
import Summary from "./summary";
import FactualityQuestion from './form';
import StatusBar from './status';

class InstructionsTest extends React.Component {

    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            currentSummary:0,
            currentSentence:0,
            missingCategories:false,
            factual:true,
            currentCategories:new Set(),
            mistakes:0,
            feedback:'',
        };

        this.article_lines = props.testData.article_lines;
        this.article = props.testData.article;
        this.summaries = props.testData.summaries;
        this.shuffle(this.summaries);

        this.handleChange = this.handleChange.bind(this);
        this.handleNext = this.handleNext.bind(this);
        this.handleBack = this.handleBack.bind(this);
    }


    eqSet(as, bs) {
        // Check if two sets are the same.
        if (as.size !== bs.size) return false;
        for (var a of as) if (!bs.has(a)) return false;
        return true;
    }

    handleBack() {
        // Go backward by changing current summary and sentence states.
        if (this.state.currentSentence === 0 && this.state.currentSummary > 0) {
            this.setState({ currentSummary: this.state.currentSummary - 1});
            const summaryLines = this.state.articleJson[this.modelNames[this.state.currentSummary]];
            this.setState({ currentSentence: summaryLines.length - 1 });
        }
        else if (this.state.currentSentence > 0){
            this.setState({ currentSentence: this.state.currentSentence - 1});
        }
    }

    handleNext(event) {
        // We don't want refresh page.
        event.preventDefault();
        event.stopPropagation();

        // Validation of input (everything has been filled)
        if ((!this.state.factual) && (this.state.currentCategories.size === 0)) {
            this.setState({missingCategories:true});
            return;
        }
        else {
            this.setState({missingCategories:false});
        }

        // Check answer
        const answerGold = this.summaries[this.state.currentSummary].answers[this.state.currentSentence];
        const summaryLine = this.summaries[this.state.currentSummary].summaryLines[this.state.currentSentence];
        if (!this.eqSet(answerGold, this.state.currentCategories)) {
            // Provide feedback.
            if (this.state.currentCategories.size === 0) {
                this.setState({feedback: 'Error: You should have clicked on "No" and selected a category because the highlighted sentence contains a mistake.'});
            }
            else if (this.state.currentCategories.size === 1) {
                const currentCat = Array.from(this.state.currentCategories)[0];
                const feedbackMessage = this.summaries[this.state.currentSummary].feedback[this.state.currentSentence][currentCat] +
                    ' Select another category, next time try to identify entities and their relations. Click on "Tip" for more help.';
                this.setState({feedback: feedbackMessage});
            }
            else {
                this.setState({feedback:'Error: There is only one mistake in this sentence. Select one category only for this sentence.'});
            }

            // Count mistakes.
            this.setState({mistakes: this.state.mistakes + 1});

            // Log the wrong answer
            this.props.updateTestLog({
                result:false,
                selectedCategory:Array.from(this.state.currentCategories),
                correctCategory:Array.from(answerGold),
                summaryLine:summaryLine
            });
            return;
        }
        // Log correct answer
        this.props.updateTestLog({
            result:true,
            selectedCategory:Array.from(this.state.currentCategories),
            correctCategory:Array.from(answerGold),
            summaryLine:summaryLine
        });


        // Go to the next sentences
        const summaryLines = this.summaries[this.state.currentSummary].summaryLines;
        if (summaryLines.length > this.state.currentSentence + 1) {
            this.setState((state) => { return {currentSentence:state.currentSentence + 1} });
        }
        else if (this.summaries.length > this.state.currentSummary + 1) {
            this.setState((state) => { return {
                currentSentence:0,
                currentSummary:state.currentSummary + 1
            }});
        }
        else {
            this.props.handleTestResult();
        }
        // Reset current answer for new sentence.
        this.setState({
            currentCategories:new Set(),
            factual:true,
            feedback:''
        });
    }

    handleChange(event) {
        /*
            Updates the array this.categories with the currently selected categories
            and state.factual. Only an update to state.factual triggers a rerender.
        */
        let fieldName = event.target.name;
        let fieldValue = event.target.value;
        if (fieldName.includes('factuality')) {
            // Changes to factuality require reset of categories.
            this.setState({
                factual: fieldValue === 'factual',
                currentCategories:new Set()});
        }
        else {
            let newSet = new Set(this.state.currentCategories);
            // If checked add to categories.
            if (event.target.checked) {
                newSet.add(fieldValue);
            }
            // Otherwise remove from categories.
            else {
                newSet.delete(fieldValue);
            }
            this.setState({
                currentCategories:newSet
            });
        }
    }

    render() {

        const AlertFeedback = () => {
            if (this.state.feedback !== '') {
                return (
                    <Alert variant="danger">{this.state.feedback}</Alert>
                );
            }
            else {return (<div></div>);}
        };

        return (
            <div>
                <Container>
                    <Row>
                        <Col>
                            <StatusBar progress={Math.round(this.state.currentSummary / this.summaries.length * 100)}/>
                            <FactualityQuestion
                                id={`${this.state.currentSummary}-${this.state.currentSentence}`}
                                factual={this.state.factual}
                                handleChange={this.handleChange}
                                onSubmit={this.handleNext}
                                missingCategories={this.state.missingCategories}
                                other={this.state.currentCategories.has('f8')}
                                back={this.handleBack}
                            />
                            <AlertFeedback/>
                        </Col>
                    </Row>
                </Container>
                <Container fluid>
                    <Row>
                        <Col>
                            <Article
                                    article={this.article}
                                    articleLines={this.article_lines}
                                    currentSentence={this.summaries[this.state.currentSummary].summaryLines[this.state.currentSentence]}
                                    articleHtml={this.state.articleHtml}
                                    webPage='text'
                                />
                        </Col>
                        <Col>
                            <Summary
                                summaryLines={this.summaries[this.state.currentSummary].summaryLines}
                                currentSentenceIdx={this.state.currentSentence}
                            />
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default InstructionsTest;
import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

import Article from "./article";
import Summary from "./summary";
import FactualityQuestion from './form';
import EntityQuestion from './entityQuestion';
import Feedback from './feedback';
import DirectionsMainTask from './directionsMainTask';
import StatusBar from './status';

function fetchFile(path, callback, isJson = true) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState === 4) {
            if (httpRequest.status === 200) {
                var data = httpRequest.responseText;
                if (isJson) data = JSON.parse(data);
                if (callback) callback(data);
            }
        }
    };
    httpRequest.open('GET', path);
    httpRequest.send();
}

class MainTask extends React.Component {
    answers = {}
    constructor(props) {
        super(props);
        this.state = {
            // Article data (from local store).
            articleHtml: '',
            articleJson: { model_lines: [''] },
            entities: [''],
            trapsIndex: { model_lines: 0 },
            trapsCorrectCategory: { model_lines: [''] },

            // State for display.
            readDirections: false,
            readArticle: false,
            passedEntityTest: false,
            completedTask: false,
            currentSummary: 0,
            currentSentence: 0,

            // User input
            missingCategories: false,
            factual: true,
            currentCategories: new Set(),
            pickedNegativeEntity: false,
            feedback: ''
        };

        this.answers['trap'] = {};

        this.handleJson = this.handleJson.bind(this);
        this.handleHtml = this.handleHtml.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleNext = this.handleNext.bind(this);
        this.handleEntityQuestion = this.handleEntityQuestion.bind(this);
        this.beginTask = this.beginTask.bind(this);
        this.handleBack = this.handleBack.bind(this);
    }

    componentDidMount() {
        console.log(this.props.hash);
        fetchFile('articles-json/' + this.props.hash + '.json', this.handleJson, true);
        fetchFile('articles-html/' + this.props.hash + '.html', this.handleHtml, false);
    }

    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    eqSet(as, bs) {
        // Check if two sets are the same.
        if (as.size !== bs.size) return false;
        for (var a of as) if (!bs.has(a)) return false;
        return true;
    }

    getRandomInt(max) {
        // Max is excluded.
        return Math.floor(Math.random() * Math.floor(max));
    }

    handleJson(json) {
        this.modelNames = json['model_names']
        this.shuffle(this.modelNames);
        this.modelNames.forEach((name) => { this.answers[name] = {}; });
        // Insert traps in summaries in article_json (beginning or end not to disrupt)
        // Set the traps state to track which ones were traps.
        var trapsIndex = {};
        var trapsCorrectCategory = {};
        const traps = json['traps'];
        console.log(traps);
        this.modelsWithTraps = [];
        // Either insert traps inside the summary (at the end)
        if (this.props.trapsMode === 'modelEnd') {
            for (let i = 0; i < this.modelNames.length; i++) {
                // Create random index.
                var model_lines = json[this.modelNames[i]];
                const idx = model_lines.length;
                // Insert the trap in the array at the END.
                model_lines.splice(idx, 0, traps[i][1]);
                json[this.modelNames[i]] = model_lines;
                trapsIndex[this.modelNames[i]] = idx;
                trapsCorrectCategory[this.modelNames[i]] = [traps[i][0].toLowerCase()];
                this.modelsWithTraps.push(this.modelNames[i]);
            }
        }
        // Or insert them as a summary itself.
        else {
            for(var i = 0; i < this.props.trapsNum; i++) {
                const trap_name = 'trap_' + i + '_lines';
                json[trap_name] = [traps[i][1]];
                trapsCorrectCategory[trap_name] = [traps[i][0].toLowerCase()];
                this.modelNames.push(trap_name);
                this.modelsWithTraps.push(trap_name);
            }
            this.shuffle(this.modelNames);
        }
        // Json
        this.setState({
            articleJson: json,
            trapsIndex: trapsIndex,
            trapsCorrectCategory: trapsCorrectCategory
        });

        // Entities
        var entityCounterDict = json.entity_counter;
        // Create items array
        var entityDictItems = Object.keys(entityCounterDict).map(function (key) { return [key, entityCounterDict[key]]; });
        // Sort the array based on the second element
        entityDictItems.sort(function (first, second) { return second[1] - first[1]; });
        var entities = entityDictItems.slice(0, 2).map(function (elt) { return elt[0]; });
        entities.push(json.negative_entity);
        this.shuffle(entities);
        this.setState({ entities: [...entities] });

    }

    handleHtml(html) {
        this.setState({ articleHtml: html })
    }

    handleBack() {
        // Go backward by changing current summary and sentence states.
        if (this.state.currentSentence === 0 && this.state.currentSummary > 0) {
            const summaryLines = this.state.articleJson[this.modelNames[this.state.currentSummary - 1]];
            this.setState({
                currentSummary: this.state.currentSummary - 1,
                currentSentence: summaryLines.length - 1
            });
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
            this.setState({ missingCategories: true });
            return;
        }
        else {
            this.setState({ missingCategories: false });
        }

        // Store answers if the task is under way.
        const currentModel = this.modelNames[this.state.currentSummary];
        if (!this.state.completedTask) {
            // Skip adding to answers in case it is a trap, but update the trap metadata.
            if (!currentModel.startsWith('trap') &&
                this.state.trapsIndex[currentModel] !== this.state.currentSentence) {
                // Update the answers with selected categories.
                this.answers[currentModel][this.state.currentSentence] = [...this.state.currentCategories];
                for (var i = 0; i < this.answers[currentModel][this.state.currentSentence].length; i++) {
                    if (this.answers[currentModel][this.state.currentSentence][i] === 'f8') {
                        this.answers[currentModel][this.state.currentSentence][i] = 'f8:' + this.state.describe;
                    }
                }
            }
            else {
                var result;
                if (this.state.trapsCorrectCategory[currentModel][0] === 'f0') {
                    result = this.state.currentCategories.size === 0;
                }
                else {
                    result = this.state.currentCategories.has(this.state.trapsCorrectCategory[currentModel][0]);
                }
                this.answers['trap'][currentModel] = {
                    'result': result,
                    'selectedCategory': [...this.state.currentCategories],
                    'correctCategory': this.state.trapsCorrectCategory[currentModel],
                    'sentence': this.state.articleJson[currentModel][this.state.currentSentence]
                }
            }
        }
        // Go to the next sentences or summary, feedback, or submit.
        const summaryLines = this.state.articleJson[currentModel];
        if (summaryLines.length > this.state.currentSentence + 1) {
            this.setState((state) => { return { currentSentence: state.currentSentence + 1 } });
        }
        else if (this.modelNames.length > this.state.currentSummary + 1) {
            this.setState((state) => {
                return {
                    currentSentence: 0,
                    currentSummary: state.currentSummary + 1
                }
            });
        }
        else if (!this.state.completedTask) {
            this.setState({ completedTask: true });
        }
        else {
            const trapsResults = this.modelsWithTraps.map((modelName) => {
                return this.answers['trap'][modelName]['result'];
            });
            if (trapsResults.length > 0) {
                this.answers['trapsResults'] = trapsResults.reduce(function (a, b) { return a + b; }) / trapsResults.length;
            }
            else {
                this.answers['trapsResults'] = 1;
            }
            this.answers['feedback'] = this.state.feedback;
            this.props.submitMainTask(this.answers);
        }
        // Reset current answer for new sentence.
        this.setState({
            currentCategories: new Set(),
            factual: true
        });
    }

    handleChange(event) {
        let fieldName = event.target.name;
        let fieldValue = event.target.value;
        if (fieldName.includes('factuality')) {
            // Changes to factuality require reset of categories.
            this.setState({
                factual: fieldValue === 'factual',
                currentCategories: new Set()
            });
        }
        else if (fieldName.includes('entity')) {
            this.setState({
                pickedNegativeEntity: fieldValue === this.state.articleJson.negative_entity
            })
        }
        else if (fieldName.includes('feedback')) {
            this.setState({ feedback: fieldValue });
        }
        else if (fieldName.includes('describe')) {
            this.setState({ describe: fieldValue });
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
            this.setState({ currentCategories: newSet });
        }
    }

    handleEntityQuestion(event) {
        // We don't want refresh page.
        event.preventDefault();
        event.stopPropagation();

        // Let upstream handle test result. This lets us continue if necessary, or blacklist user.
        this.props.handleTest(this.state.pickedNegativeEntity);
        this.setState({
            passedEntityTest: this.state.pickedNegativeEntity
        });
    }

    beginTask() {
        this.setState({
            readDirections: true
        });
    }

    render() {
        if (!this.state.readDirections) {
            return (
                <DirectionsMainTask
                    beginTask={this.beginTask}
                />
            )
        }
        if (!this.state.readArticle) {
            return (
                <Container>
                    <Row>
                        <Col>
                            <div className="mb-20">
                                <Card className="" bg='warning'>
                                    <Card.Header>Directions</Card.Header>
                                    <Card.Body >
                                        <Card.Title>Main Task Part 1: Article</Card.Title>
                                        <Card.Text>
                                            Read the following article <b>fully</b>. Note: article could take some time to load. <br />
                                        We will ask a simple question to check you read it and you will not have access to the article.
                                    </Card.Text>
                                        <Button onClick={() => { this.setState({ readArticle: true }) }}>Finished Reading</Button>
                                    </Card.Body>
                                </Card>
                            </div>
                            <Article
                                article={this.state.articleJson.article}
                                articleLines={this.state.articleJson.article_lines}
                                currentSentence={''}
                                articleHtml={this.state.articleHtml}
                                webPage='webpage'
                            />
                        </Col>
                    </Row>
                </Container>
            )
        }
        else if (!this.state.passedEntityTest) {
            return (
                <Container>
                    <Row>
                        <Col>
                            <div className="mb-20">
                                <Card className="" bg='warning'>
                                    <Card.Header>Directions</Card.Header>
                                    <Card.Body >
                                        <Card.Title>Main Task Part 2: Article Question</Card.Title>
                                        <Card.Text>
                                            Answer the question below about the article that you just read.
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </div>
                            <EntityQuestion
                                entities={this.state.entities}
                                handleChange={this.handleChange}
                                onSubmit={this.handleEntityQuestion}
                            />
                        </Col>
                    </Row>
                </Container>
            );
        }
        else if (!this.state.completedTask) {
            return (
                <div>
                    <Container fluid>
                        <Row>
                            <Col>
                                <Container>
                                    <Row>
                                        <Col>
                                            <div className="mb-20">
                                                <Card className="" bg='warning'>
                                                    <Card.Header>Directions</Card.Header>
                                                    <Card.Body >
                                                        <Card.Title>Main Task Part 3: Find Mistakes</Card.Title>
                                                        <Card.Text>
                                                            <b>Using the article as ground-truth, find mistakes in the <span className="currentSentence">highlighted</span> sentence in the summary, and categorize the mistakes.</b><br />
                                                            {/* To help you, we <span className="relatedSentence">underline</span> the sentences in the article that are likely to contain relevant information.
                                                    These are not always available and information from other sentences might be needed. */}
                                                    To help you, we <span className="relatedSentence">underline</span> the sentences in the article that are likely to contain relevant information.
                                                    However, this is for guidance only: you should not restrict yourself to the highlighted sentences when answering the questions.
                                                    {/* In particular, when the summary uses different words from the article, no sentence in the article will be highlighted so it will be necessary to consider the whole article. */}
                                                        </Card.Text>
                                                    </Card.Body>
                                                </Card>
                                            </div>
                                            <StatusBar progress={Math.round(this.state.currentSummary / this.modelNames.length * 100)} />
                                            <FactualityQuestion
                                                id={`${this.state.currentSummary}-${this.state.currentSentence}`}
                                                factual={this.state.factual}
                                                handleChange={this.handleChange}
                                                onSubmit={this.handleNext}
                                                missingCategories={this.state.missingCategories}
                                                other={this.state.currentCategories.has('f8')}
                                                back={this.handleBack}
                                            />
                                        </Col>
                                    </Row>
                                </Container>
                                <Container fluid>
                                    <Row>
                                        <Col>
                                            <Article
                                                article={this.state.articleJson.article}
                                                articleLines={this.state.articleJson.article_lines}
                                                currentSentence={this.state.articleJson[this.modelNames[this.state.currentSummary]][this.state.currentSentence]}
                                                articleHtml={this.state.articleHtml}
                                                webPage='text'
                                            />
                                        </Col>
                                        <Col>
                                            <Summary
                                                summaryLines={this.state.articleJson[this.modelNames[this.state.currentSummary]]}
                                                currentSentenceIdx={this.state.currentSentence}
                                            />
                                        </Col>
                                    </Row>
                                </Container>
                                <Container>
                                    <Row>
                                        <Col>
                                            <Article
                                                article={this.state.articleJson.article}
                                                articleLines={this.state.articleJson.article_lines}
                                                currentSentence={this.state.articleJson[this.modelNames[this.state.currentSummary]][this.state.currentSentence]}
                                                articleHtml={this.state.articleHtml}
                                                webPage='webpage'
                                            />
                                        </Col>
                                    </Row>
                                </Container>
                            </Col>
                        </Row>
                    </Container>
                </div>
            );
        }
        else {
            return (
                <Feedback
                    handleChange={this.handleChange}
                    onSubmit={this.handleNext}
                    // TODO: add back
                />
            )
        }

    }
}

export default MainTask;
import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

import { db } from "./firebase";
import { queryDict } from "./queryString";
import { FirstTest, SecondTest } from "./testData";

import BlackList from "./components/blackList";
import Instructions from "./components/instructions";
import InstructionsTest from "./components/instructionsTest";
import MainTask from "./components/mainTask";
import Preview from "./components/preview";
import Title from "./components/title";
import TaskComplete from "./components/taskComplete";
import DirectionsTest from './components/directionsTest';

/*
0. test instructions:
    Categorize the errors in these sentences (you will only do it once).

1. test:
    Read article
    Answer question on reading comprehension

2. For each summary:
    For each sentence:
        Ask factuality
        Ask category
*/
const whiteListedUsers = ['A2DVV59R1CQU6T', 'A2Q3FS9G8ITCN7', 'ATJVY9O4CY5EX', 'A1F6MWP9A0XLJQ', 'A1FB5AD91CD1W0', 'A3OHYXTHW11HS7', 'A14YB9AM2A1FO6', 'AB02KM8YTG5T7', 'A272X64FOZFYLB', 'A14WLAP6TCEKO0', 'AAASQIW3J32OL', 'A3C8JI69WPTKWH', 'A2VRDE2FHCBMF8', 'A2Z75NJBZ46RE9', 'A1I0DV4B4MFQCL', 'AE861G0AY5RGT', 'AKQAI78JTXXC9', 'A36Z3GE8IUMRLH', 'A39148ITT8EQCN', 'A3D1M3FDM1Z8E4', 'AK4LCXAHDT2FT', 'A1GI1RHRK5IOAD', 'A1TIZIFU19WTDU', 'A3GAQNTZ1V1VO', 'A20SXG1DHDIDI7', 'A34CPKFZXBX1PO', 'A2QPKPCQC0ZY37', 'A2V0P33AGS836O', 'A2XVDB1OXWGTN9', 'A2XMYHTHDZEM4U', 'A2Y9ZNZ0F24GHB', 'A3GHXWLVYPFZKQ', 'A28MLQ9WYYKIF2', 'A3JDCLX5RZBGUP', 'A13TA3WX9VH0MM', 'A25S8BTK83Z7VE', 'A122LRCSBAD6DC', 'A3OC12JBDS17NC', 'A27SMEOPKV84VI', 'APXNY64HXO08K'];

class App extends React.Component {
    // INSTRUCTION TEST
    // Query database to see if test passed.
    // Give test.
    // Handle passed test.
    // Handle failed test.
    // Update database

    // PARSE JSON OF DOCUMENT
    // for each summary for each sentence
    // Ask question
    // store the results
    // send results back to firestore
    // submit send results back to mturk

    currentTestLog = [];
    currentMistakes = 0;

    testLog = {};
    mistakes = {};
    passedEntityTest = false;
    instructionsOpen = true;

    constructor(props) {
        super(props);
        this.state = {
            userData: {
                blackList: false,
                passedTest: false
            },
            completedTask: false,
            readTestDirections: false,
            passedFirstTest: (queryDict.testOnly === "mainTaskOnly"),
            startTime: new Date().getTime() / 1000 / 60
        };
        this.handleTest = this.handleTest.bind(this);
        this.handleEntityTest = this.handleEntityTest.bind(this);
        this.setFirestorePostMturkUserData = this.setFirestorePostMturkUserData.bind(this);
        this.setFirestorePostMturkResultData = this.setFirestorePostMturkResultData.bind(this);
        this.postToMturkUserData = this.postToMturkUserData.bind(this);
        this.postToMturkResultData = this.postToMturkResultData.bind(this);
        this.postToMturk = this.postToMturk.bind(this);
        this.submitMainTask = this.submitMainTask.bind(this);
        this.moveToTest = this.moveToTest.bind(this);
        this.updateTestLog = this.updateTestLog.bind(this);
        this.setOpenInstructions = this.setOpenInstructions.bind(this);
    }

    componentDidMount() {
        // Query firestore.
        const docRef = db.collection('users').doc(`${queryDict.workerId}`);
        docRef.get().then(function (doc) {
            var userData;
            if (doc && doc.exists) {
                userData = doc.data();
            }
            else {
                userData = {
                    blackList: false,
                    passedTest: false,
                    numberOfHits: 0,
                    trapsResults: 0,
                };
            }
            // this.instructionsOpen = !userData["passedTest"];
            if ((userData.numberOfHits >= queryDict.maxHitsNum)
                && !(whiteListedUsers.includes(queryDict.workerId))) {
                userData.blackList = true;
            }
            return userData;
        })
        .then(userData => {
            this.setState({ userData: userData });
        }).catch(function (error) {
            console.log("Got an error:", error)
        });
    }

    setFirestorePostMturkUserData(userData, entityTest) {
        const docRef = db.collection('users').doc(`${queryDict.workerId}`);
        userData['testLog'] = JSON.stringify(this.testLog);
        userData['mistakes'] = this.mistakes;
        // Update Firestore.
        docRef.set(userData)
            .then(() => {
                this.postToMturkUserData(entityTest)
            })
            .catch(function (error) {
                console.log("Got an error saving test status to firestore.", error);
            });
    }

    postToMturkUserData(entityTest) {
        console.log("Test status saved to firestore!");
        // Post to MTurk.
        if (queryDict.host !== "") {
            var mturkData = {
                firstTestLog: JSON.stringify(this.testLog['firstTest']),
                secondTestLog: JSON.stringify(this.testLog['secondTest']),
                firstTestMistakes: this.mistakes['firstTest'],
                secondTestMistakes: this.mistakes['secondTest'],
            }
            if (entityTest) {
                mturkData['passedEntityTest'] = this.passedEntityTest;
            }
            this.postToMturk(mturkData);
        }
    }

    setFirestorePostMturkResultData(resultData) {
        const docRef = db.collection('results').doc(`${queryDict.hash}`).collection('workerId').doc(`${queryDict.workerId}`);
        const userRef = db.collection('users').doc(`${queryDict.workerId}`);
        var numberOfHits = this.state.userData['numberOfHits'];
        var trapsResults_old = this.state.userData['trapsResults'];
        var trapsResults_current = resultData['trapsResults'];
        var timeTaken = (new Date().getTime() / 1000 / 60 - this.state.startTime); // Times are in milliseconds we express them in minutes
        if (typeof numberOfHits === 'undefined' || isNaN(numberOfHits)) {
            numberOfHits = 0;
        }
        if (typeof trapsResults_old === 'undefined' || isNaN(trapsResults_old)) {
            trapsResults_old = 0;
        }
        const newTrapsResults = (trapsResults_old * numberOfHits + trapsResults_current) / (numberOfHits + 1);
        var userData = {
            ...this.state.userData,
            numberOfHits: numberOfHits + 1,
            trapsResults: newTrapsResults,
            blackList: (newTrapsResults < queryDict.minTrap) || (timeTaken < queryDict.minTime)
        };
        // Set Firestore.
        docRef.set({
            ...resultData,
            passedEntityTest: this.passedEntityTest,
            testLog: this.testLog,
            mistakes: this.mistakes
        }).then(() => {
            return userRef.set(userData);
        }).then(() => {
            resultData['numberOfHits'] = userData['numberOfHits'];
            resultData['blackList'] = userData['blackList'];
            this.postToMturkResultData(resultData);
        }).catch(function (error) {
            console.log("Got an error saving results to firestore and Mturk.", error);
        });
    }

    postToMturkResultData(resultData) {
        console.log("Results saved to firestore!");
        // Post back to Mturk but not if manually tested.
        if (queryDict.host !== "") {
            this.postToMturk({
                passedEntityTest: this.passedEntityTest,
                resultData: JSON.stringify(resultData),
                firstTestLog: JSON.stringify(this.testLog['firstTest']),
                secondTestLog: JSON.stringify(this.testLog['secondTest']),
                firstTestMistakes: this.mistakes['firstTest'],
                secondTestMistakes: this.mistakes['secondTest']
            });
        }
    }

    handleEntityTest(passedTest) {
        this.passedEntityTest = passedTest;
        // When test is not passed need to post the result and also update firestore.
        if (!passedTest && queryDict.entityTest !== "continue") {
            const userData = {
                ...this.state.userData,
                blackList: true,
                failedTest: 'entityTest'
            };
            this.setFirestorePostMturkUserData(userData, true);
            // Otherwise just update the firestore.
            this.setState({ userData: userData });
        }

    }

    handleTest() {
        const currentTest = !this.state.passedFirstTest ? 'firstTest' : 'secondTest';
        this.testLog = {
            ...this.testLog,
            [currentTest]: this.currentTestLog
        };

        this.mistakes = {
            ...this.mistakes,
            [currentTest]: this.currentMistakes
        };

        // If first test done, move to second test.
        if (!this.state.passedFirstTest) {
            this.currentTestLog = [];
            this.currentMistakes = 0;
            this.setState({ passedFirstTest: true });
            return;
        }
        const userData = {
            ...this.state.userData,
            blackList: false,
            passedTest: true
        };
        this.setState({ userData: userData });
        // This handles end of testing.
        if (queryDict.testOnly === "testOnly") {
            // Update the firestore and post to mturk..
            this.setFirestorePostMturkUserData(userData, false);
            // Set task complete.
            this.setState({ completedTask: true });
        }
    }

    setOpenInstructions(open) {
        this.instructionsOpen = open;
    }

    updateTestLog(answer) {
        this.currentTestLog.push(answer);
        this.currentMistakes += !answer.result;
    }

    moveToTest() {
        this.setState({
            readTestDirections: true
        });
    }

    postToMturk(resultsDict) {
        /*
            Expects dict key-values as strings.
            Cannot use FormData + POST because CORS is not allowed (you would have access to the
            server reply). Instead we can use this dummy input with form submit to make it work.
        */
        // Add data from query (necessary to identify HIT) and from the resultsDict.
        const params = { ...queryDict, ...resultsDict };

        // The rest of this code assumes you are not using a library.
        // It can be made less wordy if you use one.
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = queryDict.host;

        for (const key in params) {
            if (params.hasOwnProperty(key)) {
                const hiddenField = document.createElement('input');
                hiddenField.type = 'hidden';
                hiddenField.name = key;
                hiddenField.value = params[key];

                form.appendChild(hiddenField);
            }
        }

        document.body.appendChild(form);
        form.submit();
    }

    submitMainTask(resultData) {
        /*
            `resultData` should not contain Set. It should be all JSON.stringifyable.
        */
        // Update firestore.
        this.setFirestorePostMturkResultData(resultData);
        // Set task complete.
        this.setState({ completedTask: true });
    }

    render() {
        // Things that don't require instructions.
        if (this.state.userData.blackList) {
            return <BlackList />;
        }
        else if (this.state.completedTask) {
            return <TaskComplete />;
        }

        // Instructions and title.
        const CommonBlock = () => {
            return (
                <Container>
                    <Row>
                        <Col>
                            <Container>
                                <Title />
                                <Instructions
                                    open={this.instructionsOpen}
                                    setOpen={this.setOpenInstructions}
                                    bonus={queryDict.bonus}
                                    bonusMomentum={queryDict.bonusMomentum}
                                />
                            </Container>
                        </Col>
                    </Row>
                </Container>
            )
        };

        // Main task components.
        const Task = () => {
            if (queryDict.assignmentId === 'ASSIGNMENT_ID_NOT_AVAILABLE') {
                return <Preview />;
            }
            else if (!this.state.userData.passedTest) {
                if (!this.state.readTestDirections) {
                    return (
                        <DirectionsTest
                            takeTest={this.moveToTest}
                        />
                    )
                }
                else if (!this.state.passedFirstTest) {
                    return (
                        <div>
                            <Container>
                                <Row>
                                    <Col>
                                        <div className="mb-20">
                                            <Card className="" bg='warning'>
                                                <Card.Header>Directions</Card.Header>
                                                <Card.Body >
                                                    <Card.Title>Find Mistakes</Card.Title>
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
                                    </Col>
                                </Row>
                            </Container>
                            <InstructionsTest
                                testData={new FirstTest()}
                                handleTestResult={this.handleTest}
                                updateTestLog={this.updateTestLog}
                            />
                        </div>
                    );
                }
                else {
                    return (
                        <div>
                            <Container>
                                <Row>
                                    <Col>
                                        <div className="mb-20">
                                            <Card className="" bg='warning'>
                                                <Card.Header>Directions</Card.Header>
                                                <Card.Body >
                                                    <Card.Title>Find Mistakes</Card.Title>
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
                                    </Col>
                                </Row>
                            </Container>
                            <InstructionsTest
                                testData={new SecondTest()}
                                handleTestResult={this.handleTest}
                                updateTestLog={this.updateTestLog}
                            />
                        </div>
                    );
                }
            }
            else {
                return (
                    <MainTask
                        handleTest={this.handleEntityTest}
                        submitMainTask={this.submitMainTask}
                        hash={queryDict.hash}
                        trapsMode={queryDict.trapsMode}
                        trapsNum={queryDict.trapsNum}
                    />
                );
            }
        }

        return (
            <div>
                <CommonBlock />
                <Task />
            </div>
        );
    }
}



export default App;
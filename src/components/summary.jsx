import React from 'react';
import { Card } from 'react-bootstrap';

const Summary = (props) => {
    return (
        <div className='mb-20'>
            <h2>Summary</h2>
            <Card>
                <Card.Body>
                    <Card.Text> {
                        props.summaryLines.map((sentence, index) => {
                            // Add period if not present.
                            var sentenceWithPeriod;
                            if (['.', '?', '!'].includes(sentence[sentence.length-1])) {
                                sentenceWithPeriod = sentence;
                            }
                            else {
                                sentenceWithPeriod = sentence + ' .'
                            }
                            // Highlight current sentence.
                            if (index !== props.currentSentenceIdx) {
                                return (<span key={index}> {sentenceWithPeriod} </span>);
                            }
                            else {
                                return (<span key={index} className="currentSentence">{sentenceWithPeriod} </span>);
                            }
                        })
                    } </Card.Text>
                </Card.Body>
            </Card>
        </div>
    );
}

export default Summary;
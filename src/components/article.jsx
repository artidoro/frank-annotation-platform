import React from 'react';
import { Card } from 'react-bootstrap';


const Article = (props) => {
    const iframeStyle = {
        width: '100%',
        height: '800px',
        border: '0',
        position: 'absolute',
        // ['padding-right']:'35px'
        // padding:'15px'
    }

    function getRelatedSentences(articleLines, currentSentenceSplit) {
        /*
            Returns array of indices of sentences that have an
            overlapping sequence of at least 5 words with the current_sentence.
        */
        var overlapping = new Set();
        // Iterate over possible sequence lengths > 5.
        for (var span_len = currentSentenceSplit.length; span_len>=5; span_len--) {
            // Iterate over possible sequences in the current sentence.
            for (var start_idx = 0; start_idx + span_len <= currentSentenceSplit.length; start_idx+=2) {
                const sequence = currentSentenceSplit.slice(start_idx, start_idx+span_len).join(" ");
                for (var line_nb = 0; line_nb < articleLines.length; line_nb++) {
                    if (articleLines[line_nb].includes(sequence)) {
                        overlapping.add(line_nb);
                    }
                }
            }
        }
        return overlapping;
    }

    const overlapping = getRelatedSentences(props.articleLines, props.currentSentence.split(" "));

    if (props.webPage === 'both') {
        return (
            <div>
                <div className="mb-20">
                    <h2>Article Text</h2>
                    <Card>
                        <Card.Body>
                            <Card.Text> {
                                props.articleLines.map((sentence, index) => {
                                    if (!(overlapping.has(index) || overlapping.has(index+1) || overlapping.has(index-1))) {
                                        return (<span key={index}> {sentence} </span>);
                                    }
                                    else {
                                        return (<span key={index} className="relatedSentence">{sentence} </span>);
                                    }
                                })
                            }
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </div>
                <div>
                    <h2>Article Webpage</h2>
                    <iframe
                        title='article-web-page'
                        srcDoc={props.articleHtml}
                        style={iframeStyle}
                        frameBorder={'0'}
                        width={'100%'}
                        height={'800px'}
                    />
                </div>
            </div>
        );
    } else if (props.webPage === 'text') {
        return (
            <div className="mb-20">
                <h2>Article Text</h2>
                <Card>
                    <Card.Body>
                        <Card.Text> {
                            props.articleLines.map((sentence, index) => {
                                if (!(overlapping.has(index) || overlapping.has(index+1) || overlapping.has(index-1))) {
                                    return (<span key={index}> {sentence} </span>);
                                }
                                else {
                                    return (<span key={index} className="relatedSentence">{sentence} </span>);
                                }
                            })
                        }
                        </Card.Text>
                    </Card.Body>
                </Card>
            </div>
        )
    } else if (props.webPage === 'webpage') {
        return (
            <div>
                <h2>Article Webpage</h2>
                <iframe
                    title='article-web-page'
                    srcDoc={props.articleHtml}
                    style={iframeStyle}
                    frameBorder={'0'}
                    width={'100%'}
                    height={'800px'}
                />
            </div>
        )
    }
}

export default Article;
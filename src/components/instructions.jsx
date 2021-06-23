import React, { useState } from 'react';
import { Collapse, Button, Card } from 'react-bootstrap';

function Instructions(props) {
    const [open, setOpen] = useState(props.open);

    return (
        <div className="jumbotron pt-3 pb-3">
            <Collapse in={open}>
                <div className="instructions" id="instructions">
                    <section id="general-instructions">
                    <div className="text-center">
                        <Button
                            onClick={() => {
                                props.setOpen(!open);
                                setOpen(!open);
                            }}
                            aria-controls="instructions"
                            aria-expanded={open}
                        >
                            Toggle Instructions
                        </Button>
                    </div>
                    <hr/>
                    <h2 className="text-center">Instructions</h2>

                    <p>
                        In this task you will read a news article and several summaries of the article.
                        Afterward, you will be asked to report on whether the facts in these summaries are correct,
                        and what kind of mistakes, if any, are present.
                        You will have to identify specific sentences in the summary where information is inaccurate.
                    </p>
                    <p>
                        In the following passage we <span className="entity">highlight <i><strong>entities</strong></i></span>.
                        An entity is generally a thing, a person, an organization, a place, a number, etc.
                        To help us identify wrong facts in the summaries, you will have to find out if the <i><strong>relationships between entities</strong></i> are sound.
                        In other words, whether all the facts are correct.
                    </p>
                    <p>
                        Passage: <i> <span className="entity">The first vaccine</span> for <span className="entity">Ebola</span> was approved by <span className="entity">the FDA</span> in <span className="entity">2019</span> in <span className="entity">the US</span>, <span className="entity">five years</span> after <span className="entity">the initial outbreak</span> in <span className="entity">2014</span>. To produce <span className="entity">the vaccine</span>, <span className="entity">scientists</span> had to sequence <span className="entity">the DNA</span> of <span className="entity">Ebola</span>, then identify possible <span className="entity">vaccines</span>, and finally show successful <span className="entity">clinical trials</span>. <span className="entity">Scientists</span> say <span className="entity">a vaccine</span> for <span className="entity">COVID-19</span> is unlikely to be ready <span className="entity">this year</span>, although <span className="entity">clinical trials</span> have already started. Over <span className="entity">200,000 people</span> have died of <span className="entity">COVID-19</span> in <span className="entity">the US</span>.</i>
                    </p>
                    </section>
                    <section id="what-is-an-error">
                    <h4>What is an error</h4>
                    <p>
                        Below, we list the potential errors present in the passage above as examples of types of errors.
                        These errors are placed into categories depending on the type of error that is present.
                        Later, you will be asked to identify the types of errors in other passages.
                    </p>
                    <ul>
                        <li><strong>Information not in article:</strong>
                        <br/>The summary contains either an entity that was not in the article or a relation that cannot be verified using the article.
                        <br/><i>Example 1: <span className="wrong">China</span> has already started clinical trials of the COVID-19 vaccine.</i>
                        <br/><i>Example 2: The FDA <span className="wrong">is researching</span> the COVID-19 vaccine.</i>
                        <br/><i>Explanation 1: The entity "<span className="wrong">China</span>" was never mentioned in the article. Even though the information might be true, since it was not contained in the article the fact should be considered wrong.</i>
                        <br/><i>Explanation 2: Both entities "The FDA" and "the COVID-19 vaccine" appear in the article. However, the relation "<span className="wrong">is researching</span>" cannot be verified based on the article (even though the information might be true) so the fact should be considered wrong.</i></li>

                        <li><strong>Grammatically meaningless:</strong>
                        <br />The grammar of the sentence is so wrong that it becomes meaningless. Minor grammar errors should not be penalized if the meaning of the sentence is still clear.
                        <br /><i>Example: The Ebola vaccine accepted have already started.</i>
                        <br /><i>Explanation: The sentence is too ambiguous for the meaning to be understood correctly so the fact expressed should be considered wrong.</i></li>

                        <li><strong>Wrong use of pronoun or reference:</strong>
                        <br/>When a pronoun (he, she, it, they, you, ...) or a referring expression ("the former", ...) is misused and does not refer to anything in the summary.
                        <b> IMPORTANT: The summary should make sense on its own. No information from the article should be necessary to understand what pronouns refer to.</b>
                        <br/><i>Example 1: A vaccine was approved in 2019 in the US, five years after <span className="wrong">its</span> initial outbreak.</i>
                        <br/><i>Example 2: A vaccine for Ebola was approved in 2019 in the US. <span className="wrong">They</span> said a vaccine for COVID-19 is unlikely to be ready this year.</i>
                        <br/><i>Example 3: The vaccine for Ebola was approved by <span className="wrong">the agency</span> in 2019 in the US.</i>
                        <br/><i>Explanation 1: In the summary, there is no mention of the virus before "<span className="wrong">its</span>", therefore, the reference is unclear.</i>
                        <br/><i>Explanation 2: In the summary, no one is mentioned before the pronoun "<span className="wrong">They</span>", therefore, the reference is unclear.</i>
                        <br/><i>Explanation 3: In the summary, no agency (FDA) is mentioned before the referring expression "<span className="wrong">the agency</span>", therefore, the reference is unclear.</i>
                        </li>

                        <li><strong>Wrong relationship between entities:</strong>
                        <br />What happened (typically described by the verb) is wrong. In other words, the "relationship" between entities is wrong.
                        <br /><i>Example: The Ebola vaccine was <span className="wrong">rejected</span> by the FDA in 2019.</i>
                        <br /><i>Explanation: The article says that the Ebola vaccine was <span className="correct">approved</span> by the FDA in 2019.
                        Thus, the relationship "<span className="wrong">rejected</span>" between the two entities
                        "Ebola vaccine" and "FDA" in the above example is wrong.</i></li>

                        <li><strong>Wrong entities in the relation:</strong>
                        <br />The "who", "what", or "to whom" is wrong or its attribute. The relationship was expressed in the text but with wrong entities or with entities with wrong attributes.
                        <br /><i>Example 1: The <span className="wrong">COVID-19 vaccine</span> was approved by the FDA in 2019.</i>
                        <br /><i>Example 2: Over <span className="wrong">20 million</span> people have died in the US.</i>
                        <br /><i>Explanation 1: The article mentions the relationship of "being approved by the FDA in 2019".
                            However, what was approved was the <span className="correct">Ebola vaccine</span> and not the <span className="wrong">COVID-19 vaccine</span>.
                            Thus the entity in the relationship is wrong.</i>
                        <br /><i>Explanation 2: The attribute <span className="wrong">20 million</span> of the entity "people" is wrong, so this makes a wrong entity.</i></li>

                        <li><strong>Wrong circumstance:</strong>
                        <br />Wrong location, time, date, goal, manner, adverbs etc. specifying a relation.
                        <br /><i>Example 1: The first vaccine for Ebola was approved by the FDA in <span className="wrong">2014</span>.</i>
                        <br /><i>Example 2: A vaccine for the new virus <span className="wrong">will certainly</span> be available by the end of the year.</i>
                        <br /><i>Explanation 1: The article says the vaccine was approved in <span className="correct">2019</span>.Thus, the date "<span className="wrong">2014</span>" is wrong.</i>
                        <br /><i>Explanation 2: The article says the vaccine is "<span className="correct">unlikely</span>" to be ready this year. Therefore, the circumstance specification "<span className="wrong">certainly</span>" is wrong.</i></li>

                        <li><strong>How facts relate to one another:</strong>
                        <br />Logical or temporal sequence of facts is wrong. This involves two or more facts.
                        <br /><i>Example: To produce the vaccine, scientists have to show successful human trials, <span className="wrong">then</span> sequence the DNA of the virus.</i>
                        <br /><i>Explanation: The article explains that before starting human trials, it is first necessary to sequence the DNA of the virus. However, the logical link between the two facts is inverted, which is an error.</i></li>
                    </ul>
                    <p />
                    </section>
                    <section id="what-is-not-an-error">
                    <h4>What is not an error</h4>
                    <p>
                        The following should NOT be considered mistakes:
                    </p><ul>
                        <li>
                        Minor grammar errors (if the meaning of the sentence is still clear)
                        </li>
                        <li>
                        Repetitions of words or phrases.
                        </li>
                        <li>
                        Presence of "UNK". We replace some words within the passage to "UNK," a placeholder for unknown words. These should not be considered errors.
                        </li>
                    </ul>
                    <p />
                    </section>
                    {/* <section id="highlights">
                    <h4>Underlining</h4>
                    <p>
                        To help you, we underline the sentences in the article that are likely to contain relevant information. However, this is for guidance only: you should not restrict yourself to the highlighted sentences when answering the questions. In particular, when the summary uses different words from the article, no sentence in the article will be highlighted so it will be necessary to consider the whole article.

                    </p>
                    </section> */}
                    <section id="multiple-categories">
                    <h4>What if there are several mistakes</h4>
                    <p>
                        Select all the categories that apply.
                    </p>
                    </section>
                    <section id="time">
                    <h3>Time</h3>
                    <p>
                        This HIT is designed to take 15-20 min, the first time should take longer (~20 min).
                    </p>
                    </section>
                    <section id="shortcuts">
                    <h3>Keyboard Shortcuts</h3>
                    <p>
                        Press "Enter" instead of clicking "Next".
                    </p>
                    </section>
                    <hr/>
                </div>
            </Collapse>
            <div className="text-center">
                <div className="mb-20">
                    <Card className="" bg='danger'>
                        <Card.Body >
                            <Card.Title>Bonus: Maintain quality work to get bonuses and remain qualified</Card.Title>
                            <Card.Text>
                                <b>You will be awarded a ${props.bonus} bonus for quality work per HIT and an extra ${props.bonusMomentum} bonus every 10 quality HITs.</b>
                                <br/>
                                <b>If your work quality is poor we will revoke your qualification and if it is very poor you will not be paid.</b>
                                <br/>
                                We will check your answers and ensure that your work quality remains high.
                                The results of this HIT will be used to conduct <b>research</b>.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </div>
                <Button
                    onClick={() => {
                        props.setOpen(!open);
                        setOpen(!open);
                    }}
                    aria-controls="instructions"
                    aria-expanded={open}
                >
                    Toggle Instructions
                </Button>
            </div>
        </div>
    );
}

export default Instructions;

import React from 'react';
import { Container } from 'react-bootstrap';

const BlackList = () => {
    return (
        <Container>
            <div className='text-center'>
                <h1>You are done with the task!</h1>
                {/* <p>You have already completed the task, thank you for your work.</p> */}
                <p>We cannot accept more work from you at this time. Thank you for your work.</p>
            </div>
        </Container>
    );
}

export default BlackList;
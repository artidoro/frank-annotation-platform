import React from 'react';
import { Container } from 'react-bootstrap';

const TaskComplete = () => {
    return (
        <Container>
            <div className='text-center'>
                <h2>You completed the HIT!</h2>
                <p>Please accept the next HIT to continue working.</p>
            </div>
        </Container>
    );
}

export default TaskComplete;
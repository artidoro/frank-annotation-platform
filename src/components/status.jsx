import React from 'react';
import { Container, ProgressBar } from 'react-bootstrap';

const StatusBar = (props) => {
    return (
        <Container>
            <ProgressBar className="mb-20" now={props.progress} label={`${props.progress}%`} />
        </Container>
    );
}

export default StatusBar;
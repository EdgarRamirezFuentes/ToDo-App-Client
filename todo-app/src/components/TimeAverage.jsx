import React from 'react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import {Container, Row, Col } from 'react-bootstrap';


const TimeAverage = ({ tasks }) => {
    const [Low, setLow] = useState(0);
    const [Medium, setMedium] = useState(0);
    const [High, setHigh] = useState(0);
    const [Total, setTotal] = useState(0);

    // Update each time the tasks change
    useEffect(() => {
        axios.get('http://localhost:9090/api/v1/todo/task/average/')
        .then((response) => {
            const { Low, Medium, High, Total } = response.data;
            setLow(Low ? Low : 0);
            setMedium(Medium ? Medium : 0);
            setHigh(High ? High : 0);
            setTotal(Total ? Total : 0);
        })
        .catch((error) => {
            console.log(error);
        })
    }, [tasks]);

    
    return (
        <>
            { tasks.length > 0 &&       
                <Container>
                    <Row>
                        <Col className='text-center'>
                            <h2>Average time to finish a task</h2>
                            <h3>{Math.ceil(Total)} minutes</h3>
                        </Col>
                        <Col>
                            <h2>Average time to finish a task by priority</h2>
                            <h3>Low priority: {Math.ceil(Low)} minutes</h3>
                            <h3>Medium priority: {Math.ceil(Medium)} minutes</h3>
                            <h3>High priority: {Math.ceil(High)} minutes</h3>
                        </Col>
                    </Row>    
                </Container>  
            }
        </>  
    )

}

export default TimeAverage;
import { useState } from "react";
import axios from "axios";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from "react-bootstrap/esm/Button";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'


const SearchTask = ({setTasks, setTotalTasks, setCurrentPage}) => {
    const [task, setTask] = useState('');
    const [priority, setPriority] = useState('0');
    const [taskStatus, setTaskStatus] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();

        let url = `http://localhost:9090/api/v1/todo/task`;
        let firstParameter = true;

        if (task) {
            url += (firstParameter ? '?' : '&') + `name=${task}`;
            firstParameter = false;
        }
        if (priority !== '0') {
            url += (firstParameter ? '?' : '&') + `priority=${priority}`;
            firstParameter = false;
        }
        if (taskStatus) {
            url += (firstParameter ? '?' : '&') + `isDone=${taskStatus}`;
        }

        console.log(url);

        axios.get(url)
        .then((response) => {
            const { totalTasks, tasks } = response.data;
            console.log(response.data);
            setTasks(tasks);
            setTotalTasks(totalTasks);
            setCurrentPage(1);

        })
        .catch((error) => {
            console.log(error);
        })
    }

     
    const handleChangePriority = (event) => {
        setPriority(event.target.value);
    }

    const handleChangeTaskStatus = (event) => {
        setTaskStatus(event.target.value);
    }

    return (
        <>
            <Container>
                <Row>
                    <Col>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId="searchTaskForm">
                                <Container>
                                    <Row className="my-3">
                                        <Col xs={2} className="d-flex justify-content-center align-items-center">
                                            <Form.Label className="mb-0">Task name</Form.Label>
                                        </Col>
                                        <Col xs={8}>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter task name"
                                                value={task}
                                                onChange={(event) => setTask(event.target.value)}
                                            />
                                        </Col>
                                    </Row>
                                    <Row className="my-3">
                                        <Col xs={2} className="d-flex justify-content-center align-items-center">
                                            <Form.Label className="mb-0">Priority</Form.Label>
                                        </Col>
                                        <Col xs={5}>
                                            <Form.Control
                                                as="select"
                                                value={priority}
                                                onChange={handleChangePriority}
                                            >
                                                <option value="0">All</option>
                                                <option value="1">Low</option>
                                                <option value="2">Medium</option>
                                                <option value="3">High</option>
                                            </Form.Control>
                                        </Col>
                                    </Row>
                                    <Row className="my-3">
                                        <Col xs={2} className="d-flex justify-content-center align-items-center">
                                            <Form.Label className="mb-0">Status</Form.Label>
                                        </Col>
                                        <Col xs={5}>
                                            <Form.Control
                                                as="select"
                                                value={taskStatus}
                                                onChange={handleChangeTaskStatus}
                                            >
                                                <option value="">All</option>
                                                <option value="true">Done</option>
                                                <option value="false">Undone</option>
                                            </Form.Control>
                                        </Col>
                                    </Row>
                                    <Row className="my-3">
                                        <Col xs={10} className="d-flex justify-content-end">
                                            <Button
                                                variant="primary"
                                                type="submit"
                                                className="w-25"
                                            >
                                                Search <FontAwesomeIcon icon={faSearch} className="ms-3" />
                                            </Button>
                                        </Col>
                                    </Row>
                                </Container>
                            </Form.Group>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default SearchTask;
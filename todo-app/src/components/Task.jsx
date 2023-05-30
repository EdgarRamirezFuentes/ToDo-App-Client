/**
 * Task component
 * @param {object} props
 * @param {string} props.id
 * @param {string} props.name
 * @param {string} props.priority
 * @param {string} props.priorityName
 * @param {string} props.dueDate
 * @param {boolean} props.isDone
 * @param {function} props.doneDate
 */

import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faPenToSquare} from '@fortawesome/free-solid-svg-icons'
import {faTrashAlt} from '@fortawesome/free-solid-svg-icons'

import axios from 'axios'

const MySwal = withReactContent(Swal);

const Task = ({
    id,
    name,
    priority,
    priorityName,
    dueDate,
    isDone,
    doneDate,
    setTasks,
    setCurrentPage,
    setTotalTasks
}) => {

    const handleDeleteTask = async() => {
        try {
            const { isConfirmed } = await MySwal.fire({
                title: 'Are you sure?',
                text: 'You will not be able to recover this task!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'No, keep it'
            });

            if (isConfirmed) {
                const url = `http://localhost:9090/api/v1/todo/task/${id}`;
                const response = await axios.delete(url);

                MySwal.fire({title: 'Task deleted', icon: 'success', timer: 1500, showConfirmButton: false});

                updateTaskList();
            }
        } catch (error) {
            console.log(error);

            MySwal.fire({title: 'Error', text: 'Something went wrong', icon: 'error', timer: 1500, showConfirmButton: false});
        }
    };

    const handleEditTask = async() => {
        try {
            const {value: formData, isConfirmed} = await MySwal.fire({
                title: 'Edit task',
                html: (
                    <Form>
                        <Form.Group controlId='name'>
                            <Form.Label>Name</Form.Label>
                            <Form.Control defaultValue={name} type='text'/>
                        </Form.Group>
                        <Form.Group controlId='priority'>
                            <Form.Label>Priority</Form.Label>
                            <Form.Control as='select' defaultValue={priority}>
                                <option value='0'>Select a priority</option>
                                <option value='1'>Low</option>
                                <option value='2'>Medium</option>
                                <option value='3'>High</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId='dueDate'>
                            <Form.Label>Due date</Form.Label>
                            <Form.Control
                                defaultValue={(dueDate === null
                                ? ''
                                : new Date(dueDate).toISOString().slice(0, 10))}
                                type='date'/>
                        </Form.Group>
                    </Form>
                ),
                showCancelButton: true,
                confirmButtonText: 'Edit',
                cancelButtonText: 'Cancel',
                showLoaderOnConfirm: true,
                preConfirm: () => {
                    const name = document
                        .getElementById('name')
                        .value;
                    const priority = document
                        .getElementById('priority')
                        .value;
                    const dueDate = document
                        .getElementById('dueDate')
                        .value;

                    if (name === '' || priority === '0') {
                        MySwal.showValidationMessage('Name and priority are required');
                        return;
                    }

                    if (dueDate !== '') {
                        const selectedDate = new Date(dueDate);
                        const today = new Date();

                        if (selectedDate <= today.setHours(0, 0, 0, 0)) {
                            MySwal.showValidationMessage('Due date must be greater than today');
                            return;
                        }
                    }

                    const data = {
                        name,
                        priority,
                        dueDate: (dueDate !== '')
                            ? new Date(dueDate).toISOString()
                            : ''
                    };

                    return data;
                }
            });

            if (isConfirmed) {
                await axios.put(`http://localhost:9090/api/v1/todo/task/${id}`, formData);
                MySwal.fire({title: 'Task edited', icon: 'success', timer: 1500, showConfirmButton: false});
                updateTaskList();
            }
        } catch (error) {
            console.log(error);
            MySwal.fire({title: 'Error', text: 'Something went wrong', icon: 'error', timer: 1500, showConfirmButton: false});
        }
    };

    const handleDoneTask = async() => {
        try {
            await axios.post(`http://localhost:9090/api/v1/todo/task/${id}/done`);
            MySwal.fire({title: 'Task done', icon: 'success', timer: 1500, showConfirmButton: false});
            updateTaskList();
        } catch (error) {
            console.log(error);
            MySwal.fire({title: 'Error', text: 'Something went wrong', icon: 'error', timer: 1500, showConfirmButton: false});
        }
    };

    const handleUndoneTask = async() => {
        try {
            await axios.put(`http://localhost:9090/api/v1/todo/task/${id}/undone`);
            MySwal.fire({title: 'Task undone', icon: 'success', timer: 1500, showConfirmButton: false});
            updateTaskList();
        } catch (error) {
            console.log(error);
            MySwal.fire({title: 'Error', text: 'Something went wrong', icon: 'error', timer: 1500, showConfirmButton: false});
        }
    };

    const updateTaskList = async() => {
        try {
            const response = await axios.get('http://localhost:9090/api/v1/todo/task');
            const {totalTasks, tasks} = response.data;
            setTasks(tasks);
            setTotalTasks(totalTasks);
            setCurrentPage(1);
        } catch (error) {
            console.log(error);
        }
    };

    const getBackgroundColor = (dueDate) => {
        if (dueDate === null) 
            return 'bg-white';
        
        const today = new Date();
        const due = new Date(dueDate);

        // Gettting the difference in weeks
        const diff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 3600 * 24 * 7));

        if (diff <= 1) {
            return 'bg-danger';
        } else if (diff <= 2) {
            return 'bg-warning';
        } else {
            return 'bg-success'
        }
    }

    const formatTableDate = (date) => (!date
        ? ''
        : new Date(date).toISOString().slice(0, 10));

    return <tr className={getBackgroundColor(dueDate) + ' text-center'}>
        <td>{id}</td>
        <td>{name}</td>
        <td>{priorityName}</td>
        <td>{formatTableDate(dueDate)}</td>
        <td>
            <Form.Check
                checked={isDone}
                onChange={isDone
                ? handleUndoneTask
                : handleDoneTask}></Form.Check>
        </td>
        <td>{formatTableDate(doneDate)}</td>
        <td className='bg-light'>
            <Container>
                <Row>
                    <Col>
                        <Button variant='warning' onClick={handleEditTask} className='w-100'>
                            Edit
                            <FontAwesomeIcon icon={faPenToSquare} className='ms-2'/>
                        </Button>
                    </Col>
                    <Col>
                        <Button variant='danger' onClick={handleDeleteTask} className='w-100'>
                            Delete
                            <FontAwesomeIcon icon={faTrashAlt} className='ms-2'/>
                        </Button>
                    </Col>
                </Row>
            </Container>
        </td>
    </tr>;
}

export default Task;
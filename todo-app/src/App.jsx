import { useState } from 'react';
import { useEffect } from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/esm/Button';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';


import axios from 'axios'

import './App.css'
import SearchTask from './components/SearchTask';
import TaskTable from './components/TaskTable';
import Load from './components/Load';
import PaginationComponent from './components/Pagination';
import TimeAverage from './components/TimeAverage';

const MySwal = withReactContent(Swal);

function App() {
  const [tasks, setTasks] = useState([]);
  const [totalTasks, setTotalTasks] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    axios.get('http://localhost:9090/api/v1/todo/task')
    .then((response) => {
      const { totalTasks, tasks } = response.data;
      setTasks(tasks);
      setTotalTasks(totalTasks);
    }, [])
    .catch((error) => {
      console.log(error);
    })
  }, []);

  const handleAddTask = async () => {
    try {
      const { value: formData, isConfirmed } = await MySwal.fire({
        title: 'Add Task',
        html:
          <Form>
            <Form.Group className='mb-3' controlId='formTaskName'>
              <Form.Label>Task Name</Form.Label>
              <Form.Control type='text' placeholder='Enter task name' />
            </Form.Group>
            <Form.Group className='mb-3' controlId='formTaskPriority'>
              <Form.Label>Task Priority</Form.Label>
              <Form.Select aria-label='Default select example'>
                <option value='0'>Select a priority</option>
                <option value='1'>Low</option>
                <option value='2'>Medium</option>
                <option value='3'>High</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className='mb-3' controlId='formTaskDueDate'>
              <Form.Label>Task Due Date</Form.Label>
              <Form.Control type='date' />
            </Form.Group>
          </Form>,
        focusConfirm: false,
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

      if (formData && isConfirmed) {
          const url = 'http://localhost:9090/api/v1/todo/task';
          const response = await axios.post(url, formData);
          const { task } = response.data;

          MySwal.fire({title: 'Task created', icon: 'success', timer: 1500, showConfirmButton: false});

          updateTaskList();
      }
    }
    catch (error) {
      console.log(error);
      MySwal.fire({title: 'Error', text: 'Something went wrong', icon: 'error', timer: 1500, showConfirmButton: false});
    }
  }

  
  const updateTaskList = async () => {
    try {
      const response = await axios.get('http://localhost:9090/api/v1/todo/task');
      const { totalTasks, tasks } = response.data;
      setTasks(tasks);
      setTotalTasks(totalTasks);
      setCurrentPage(1);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <Container
        className='m-5'
      >
        <Row>
          <Col className='text-center'>
            <h1>ToDo App</h1>
          </Col>
        </Row>
        <Row>
          <Col>
            <SearchTask 
            setTasks={setTasks} 
            setTotalTasks={setTotalTasks}
            setCurrentPage={setCurrentPage} />
          </Col>
        </Row>
        <Row>
          <Col xs={4}>
            <Button 
              variant='success' 
              onClick={handleAddTask}
              className='m-3 w-50'
              >
                Add Task
                <FontAwesomeIcon icon={faPlus}  className='ms-3' />
                </Button>
          </Col>
        </Row>
        <Row>
          <Col>
            {tasks ? 
            <TaskTable 
            tasks={tasks}
            setTasks={setTasks}
            setCurrentPage={setCurrentPage}
            setTotalTasks={setTotalTasks} /> 
            : <Load />}
          </Col>
        </Row>
        <Row>
          <Col className='d-flex justify-content-center align-items-center my-3'>
            <PaginationComponent
            totalTasks={totalTasks} 
            setTasks={setTasks} 
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            />
          </Col>
        </Row>
        <Row>
          <Col className='d-flex justify-content-center align-items-center my-3'>
            <TimeAverage
            tasks={tasks}
            />
          </Col>
        </Row>
        <Row
          className='mt-5'
        >
          <Col className='text-center'>
            <p>Created by <a href='https://github.com/EdgarRamirezFuentes' target='_blank' rel='noreferrer'>Edgar Ramirez</a></p>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default App

import Task from "./Task";
import Table from 'react-bootstrap/Table';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSortUp } from '@fortawesome/free-solid-svg-icons'
import { faSortDown } from '@fortawesome/free-solid-svg-icons'

import axios from 'axios';

/**
 * TaskTable component
 * @param {object} props
 * @param {object[]} props.tasks
*/

const TaskTable = ({tasks, setTasks, setCurrentPage, setTotalTasks}) => {
    if (tasks.length === 0) {
        tasks =  []
    }

    const [prioritySort, setPrioritySort] = useState('desc');
    const [dueDateSort, setDueDateSort] = useState('desc');

    const handleSortByPriority = () => {
        let url = `http://localhost:9090/api/v1/todo/task?sortByPriority=${prioritySort}`;
        axios.get(url)
        .then((response) => {
            const {totalTasks, tasks} = response.data;
            setTasks(tasks);
            setTotalTasks(totalTasks);
            setCurrentPage(1);
            setPrioritySort(prioritySort === 'asc' ? 'desc' : 'asc');
        })
        .catch((error) => {
            console.log(error);
        })
    }

    const handleSortByDueDate = () => {
        let url = `http://localhost:9090/api/v1/todo/task?sortByDueDate=${dueDateSort}`;
        axios.get(url)
        .then((response) => {
            const {totalTasks, tasks} = response.data;
            setTasks(tasks);
            setTotalTasks(totalTasks);
            setCurrentPage(1);
            setDueDateSort(dueDateSort === 'asc' ? 'desc' : 'asc');
        })
        .catch((error) => {
            console.log(error);
        })
    }

    return (
        <>
            <Table bordered hover size="lg">
                <thead
                    className="text-center"
                >
                    <tr>
                        <th>#</th>
                        <th>Task name</th>
                        <th>
                            Priority
                            <FontAwesomeIcon 
                            icon={(prioritySort === 'asc') ? faSortUp : faSortDown}
                            onClick={handleSortByPriority}
                            className="mx-4"
                             />
                        
                        </th>
                        <th>Due Date
                            <FontAwesomeIcon 
                            icon={(dueDateSort === 'asc') ? faSortUp : faSortDown}
                            onClick={handleSortByDueDate}
                            className="mx-4"
                             />
                        </th>
                        <th>Done</th>
                        <th>Done date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map((task, index) => {
                        return (
                            <Task
                                id={task.id}
                                name={task.name}
                                priority={task.priority}
                                priorityName={task.priorityName}
                                dueDate={task.dueDate}
                                isDone={task.isDone}
                                doneDate={task.doneDate}
                                key={task.id}
                                setTasks={setTasks}
                                setCurrentPage={setCurrentPage}
                                setTotalTasks={setTotalTasks}
                            />
                        )
                    })}
                </tbody>
            </Table>
        </>
    )
}


export default TaskTable;
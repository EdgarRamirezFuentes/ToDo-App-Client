import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import Task from "../Task";


import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import axios from 'axios';

const MySwal = withReactContent(Swal);

jest.mock('axios');
jest.mock('sweetalert2');



test('renders Task component', () => {
  const task = {
    id: 1,
    name: 'Task 1',
    priority: '1',
    priorityName: 'Low',
    dueDate: '2023-05-30',
    isDone: false,
    doneDate: null
  };

  render(
    <Task
      id={task.id}
      name={task.name}
      priority={task.priority}
      priorityName={task.priorityName}
      dueDate={task.dueDate}
      isDone={task.isDone}
      doneDate={task.doneDate}
    />
  );

  // Verificar que el componente se renderiza correctamente con los datos proporcionados
  expect(screen.getByText(task.name)).toBeInTheDocument();
  expect(screen.getByText(task.priorityName)).toBeInTheDocument();
  expect(screen.getByText(task.dueDate)).toBeInTheDocument();
});



  test('calls handleDeleteTask when delete button is clicked', async () => {
      axios.delete.mockResolvedValue(); // Mock de respuesta exitosa

      MySwal.fire.mockResolvedValue({ isConfirmed: true }); 

      const task = {
        id: 1,
        name: 'Task 1',
        priority: '1',
        priorityName: 'Low',
        dueDate: '2023-05-30',
        isDone: false,
        doneDate: null
      };
  
      render(
        <Task
          id= {task.id}
          name={task.name}
          priority={task.priority}
          priorityName={task.priorityName}
          dueDate={task.dueDate}
          isDone={task.isDone}
          doneDate={task.doneDate}
          setTasks={jest.fn()}
          setTotalTasks={jest.fn()}
          setCurrentPage={jest.fn()}
        />
      );
  
      const deleteButton = screen.getByText('Delete');
      await act(async () => {
        deleteButton.click(); // Simular clic en el botón de eliminación
        console.log(await new Promise((resolve) => setTimeout(resolve, 0))); // Esperar a que se resuelva la promesa interna en handleDeleteTask
      });
  
      expect(axios.delete).toHaveBeenCalledWith('http://localhost:9090/api/v1/todo/task/1');
  });

  test('calls handleEditTask when edit button is clicked', async () => {
      axios.put.mockResolvedValue();

      MySwal.fire.mockResolvedValue({ isConfirmed: true }); 
  
      const task = {
        id: 1,
        name: 'Task 1',
        priority: '1',
        priorityName: 'Low',
        dueDate: '2023-05-30',
        isDone: false,
        doneDate: null
      };
  
      render(
        <Task
          id= {task.id}
          name={task.name}
          priority={task.priority}
          priorityName={task.priorityName}
          dueDate={task.dueDate}
          isDone={task.isDone}
          doneDate={task.doneDate}
          setTasks={jest.fn()}
          setTotalTasks={jest.fn()}
          setCurrentPage={jest.fn()}
        />
      );
  
      const editButton = screen.getByText('Edit');
      await act(async () => {
        editButton.click(); 
        await new Promise((resolve) => setTimeout(resolve, 0)); 
      });
  
      expect(axios.put).toHaveBeenCalledWith('http://localhost:9090/api/v1/todo/task/1');
  });
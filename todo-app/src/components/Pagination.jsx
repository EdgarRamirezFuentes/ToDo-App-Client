/**
 * Pagination component
 * @param {object} totalTasks
 * @param {function} setTasks
 */

import Pagination from 'react-bootstrap/Pagination';
import axios from 'axios';

const PaginationComponent = ({totalTasks, setTasks, currentPage, setCurrentPage}) => {
    const pages = Math.ceil(totalTasks / 10);
    const items = [];

    for (let number = currentPage; number <= pages && number <= currentPage + 4; number++) {
        items.push(
            <Pagination.Item 
            key={number} 
            active={number === currentPage} 
            onClick={() => handlePageChange(number)}>
                {number}
            </Pagination.Item>,
        );
    }

    const handlePageChange = (pageNumber) => {
        let url = `http://localhost:9090/api/v1/todo/task?page=${pageNumber}`;
        axios.get(url)
        .then((response) => {
            const { tasks } = response.data;
            setTasks(tasks);
            setCurrentPage(pageNumber);
        })
        .catch((error) => {
            console.log(error);
        })
    }

    const handleFirstPage = () => {
        let url = `http://localhost:9090/api/v1/todo/task?page=1`;
        axios.get(url)
        .then((response) => {
            const { tasks } = response.data;
            setTasks(tasks);
            setCurrentPage(1);
        })
        .catch((error) => {
            console.log(error);
        })
    }

    const handleLastPage = () => {
        let url = `http://localhost:9090/api/v1/todo/task?page=${pages}`;
        axios.get(url)
        .then((response) => {
            const { tasks } = response.data;
            setTasks(tasks);
            setCurrentPage(pages);
        })
        .catch((error) => {
            console.log(error);
        })
    }
    
    const handlePrevPage = () => {
        if (currentPage > 1) {
            let url = `http://localhost:9090/api/v1/todo/task?page=${currentPage - 1}`;
            axios.get(url)
            .then((response) => {
                const { tasks } = response.data;
                setTasks(tasks);
                setCurrentPage(currentPage - 1);
            })
            .catch((error) => {
                console.log(error);
            })
        }
    }
    
    const handleNextPage = () => {
        if (currentPage < pages) {
            let url = `http://localhost:9090/api/v1/todo/task?page=${currentPage + 1}`;
            axios.get(url)
            .then((response) => {
                const { tasks } = response.data;
                setTasks(tasks);
                setCurrentPage(currentPage + 1);
            })
            .catch((error) => {
                console.log(error);
            })
        }
    }

    
    return (
        <>
            { totalTasks > 10 &&
                <Pagination>
                    <Pagination.First
                        onClick={handleFirstPage}   
                    />
                    <Pagination.Prev 
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                    />
                        {items} 
                    <Pagination.Next 
                        onClick={handleNextPage}
                    />
                    <Pagination.Last
                        onClick={handleLastPage}
                        disabled={currentPage === pages}
                    />
                </Pagination>
            }
        </>
    );
}

export default PaginationComponent;
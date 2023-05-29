import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import TimeAverage from '../TimeAverage';

jest.mock('axios');

describe('TimeAverage', () => {
    test('renders average time', async () => {
    const mockData = {
        Low: 10,
        Medium: 20,
        High: 30,
        Total: 60
    };
    axios.get.mockResolvedValue({ data: mockData });

    render(<TimeAverage tasks={[{}, {}]} />);

    await waitFor(() => {
        expect(screen.getByText(/^Average time to finish a task$/i)).toBeInTheDocument();
        expect(screen.getByText(/Average time to finish a task by priority/i)).toBeInTheDocument();
        expect(screen.getByText(/60 minutes/i)).toBeInTheDocument();
        expect(screen.getByText(/Low priority: 10 minutes/i)).toBeInTheDocument();
        expect(screen.getByText(/Medium priority: 20 minutes/i)).toBeInTheDocument();
        expect(screen.getByText(/High priority: 30 minutes/i)).toBeInTheDocument();
    });
    });

    test('renders average time with no tasks', async () => {
        const mockData = {
            Low: 10,
            Medium: 20,
            High: 30,
            Total: 60
        };
        axios.get.mockResolvedValue({ data: mockData });

        render(<TimeAverage tasks={[]} />);
        await waitFor(() => {
            const averageTimeValue = screen.queryByText(/^Average time to finish a task$/i);
            const priorityAverageTimeValue = screen.queryByText(/Average time to finish a task by priority/i);
            const totalValue = screen.queryByText(/60 minutes/i);
            const lowValue = screen.queryByText(/Low priority: 10 minutes/i);
            const mediumValue = screen.queryByText(/Medium priority: 20 minutes/i);
            const highValue = screen.queryByText(/High priority: 30 minutes/i);

            expect(averageTimeValue === null).toBeTruthy();
            expect(priorityAverageTimeValue === null).toBeTruthy();
            expect(totalValue === null).toBeTruthy();
            expect(lowValue === null).toBeTruthy();
            expect(mediumValue === null).toBeTruthy();
            expect(highValue === null).toBeTruthy();
        });

    });
});
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Load from '../Load';

describe('Load', () => {
    test('renders loading message', async () => {
        render(<Load />);
        await waitFor(() => {
            expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
        });
    });
});
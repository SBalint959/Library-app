import React from 'react';
import { render, screen } from '@testing-library/react';
import UsersList from '../pages/users/UsersList';

describe('UsersList', () => {
    test('Renders button for adding new user', () => {

        render(<UsersList />);

        const buttonElement = screen.getByText("Dodaj novog");
        expect(buttonElement).toBeInTheDocument();
    });
});
import React from 'react';
import { render, screen } from '@testing-library/react';
import UsersList from '../pages/users/UsersList';

describe('UsersList', () => {
  test('Renders table with correct cols', () => {

    render(<UsersList />);

    const tableElement1 = screen.getByText("Ime");
    const tableElement2 = screen.getByText("Prezime");
    const tableElement3 = screen.getByText("OIB");
    const tableElement4 = screen.getByText("Uloga");
    expect(tableElement1).toBeInTheDocument();
    expect(tableElement2).toBeInTheDocument();
    expect(tableElement3).toBeInTheDocument();
    expect(tableElement4).toBeInTheDocument();
  });
});
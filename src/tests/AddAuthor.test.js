import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import AddAuthor from '../pages/authors/AddAuthor'

test('add a new book', async () => {
   render(
       <Router>
           <AddAuthor />
       </Router>
   );

   fireEvent.change(screen.getByPlaceholderText('Ime'), { target: { value: 'Pisac' } });
   fireEvent.change(screen.getByPlaceholderText('Prezime'), { target: { value: 'Prezimac' } });
   fireEvent.change(screen.getByPlaceholderText('Biografija'), { target: { value: 'Opis pisca' } });
   fireEvent.click(screen.getByText('Dodaj autora'));

    // Wait for the success alert to appear
    await waitFor(() => expect(screen.getByRole('good-alert')).toBeInTheDocument());
   //  await waitFor(() => expect(screen.getByText('Autor uspješno dodan!')).toBeInTheDocument());
});
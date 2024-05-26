import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { Fragment, useEffect, useState, useHistory } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

import NavBar from './components/Navbar';
import Home from './pages/home/Home';
import BooksList from './pages/books/BooksList';
import BookView from './pages/books/BookView';
import AddBook from './pages/books/AddBook';
import AddRating from './pages/ratings/AddRating';
import AddAuthor from './pages/authors/AddAuthor';
import BookRatings from './pages/ratings/BookRatings';
import EditRating from './pages/ratings/EditRating'
import AuthorsList from './pages/authors/AuthorsList';
import AuthorEdit from './pages/authors/AuthorEdit';


function App() {
  return (

    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route exact path="/" element={<Home />}></Route>
        <Route exact path="/catalog" element={<BooksList />}></Route>
        <Route exact path="/catalog/:bookId" element={<BookView />}></Route>
        <Route exact path="/catalog/new" element={<AddBook />}></Route>
        <Route exact path="/catalog/:bookId/ratings" element={<BookRatings />}></Route>
        <Route exact path="/rating/:ratingId" element={<EditRating/>}></Route>
        <Route exact path="/rating/new/:bookId" element={<AddRating/>}></Route>
        <Route exact path="/authors/new" element={<AddAuthor />}></Route>
        <Route exact path="/authors/:authorId" element={<AuthorEdit />}></Route>
        <Route exact path="/authors" element={<AuthorsList />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

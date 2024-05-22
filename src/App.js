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
import TestDrive from './pages/testdrives/TestDrive';
import AddUser from './pages/users/AddUser';
import User from './pages/users/User';
import UsersList from './pages/users/UsersList';
import BookRatings from './pages/ratings/BookRatings';


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
        <Route exact path="/rating/new/:bookId" element={<AddRating/>}></Route>
        <Route exact path="/rating/:ratingId" element={<TestDrive />}></Route>
        <Route exact path="/users/new" element={<AddUser />}></Route>
        <Route exact path="/users/:userId" element={<User />}></Route>
        <Route exact path="/users" element={<UsersList />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

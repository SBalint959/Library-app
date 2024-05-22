import React, { Fragment, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";

function AddRating() {

    const bookId = useParams().bookId
    const [rating, setRating] = useState({
        reviewText: null,
        ratingGrade: null,
        book: {},
        user: {}
    })

    const books = {
        1: {
            bookId: 1,
            bookTitle: "To Kill a Mockingbird",
            bookauthor: "Harper Lee",
            genre: { genreName: "Fiction" },
            publicationyear: 1960,
            isbn: "978-0-06-112008-4"
        },
        2: {
            bookId: 2,
            bookTitle: "1984",
            bookauthor: "George Orwell",
            genre: { genreName: "Dystopian" },
            publicationyear: 1949,
            isbn: "978-0-452-28423-4"
        },
        3: {
            bookId: 3,
            bookTitle: "Moby Dick",
            bookauthor: "Herman Melville",
            genre: { genreName: "Adventure" },
            publicationyear: 1851,
            isbn: "978-0-14-243724-7"
        },
        4: {
            bookId: 4,
            bookTitle: "Pride and Prejudice",
            bookauthor: "Jane Austen",
            genre: { genreName: "Romance" },
            publicationyear: 1813,
            isbn: "978-0-19-953556-9"
        },
        5: {
            bookId: 5,
            bookTitle: "The Great Gatsby",
            bookauthor: "F. Scott Fitzgerald",
            genre: { genreName: "Tragedy" },
            publicationyear: 1925,
            isbn: "978-0-7432-7356-5"
        }
    };

    let stock = ["Civic Type R", "Taycan", "Focus Titanium"]
    let users = ["Mirko", "Stanko"]

    const addNewRating = async () => {
        try {
            const response = await fetch("http://localhost:5000/ratings/add",
                {
                    method: "POST",
                    mode: "cors",
                    headers: {
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify(rating)
                });
            let jsonData = await response.json();
            console.log(jsonData);

        } catch (e) {
            console.log(e)
        }

    }
    const onChange = e => {
        setRating({ ...rating, [e.target.name]: e.target.value })
    };

    const onSelectRatingGrade = (grade) => {
        setRating({ ...rating, ratingGrade: grade });
    };

    return (
        <>
            <br />
            <div style={{ margin: "auto", width: "50%" }}>
                
            <h2>{books[bookId].bookTitle}</h2> {/* Display book title */}
                <br />
                <Form.Select aria-label="user" onChange={e => console.log(e.target.value)}>
                    <option>Odaberite korisnika</option>
                    {users.map((user, index) => (
                        <option key={index}>{user}</option>
                    ))}
                </Form.Select>
                <br />
                <InputGroup className="mb-3">
                    <InputGroup.Text id="basic-addon1">Recenzija</InputGroup.Text>
                    <Form.Control
                        as="textarea"
                        placeholder="Napišite svoju recenziju ovdje..."
                        aria-label="reviewText"
                        name="reviewText"
                        aria-describedby="basic-addon1"
                        onChange={e => onChange(e)}
                        value={rating.reviewText}
                    />
                </InputGroup>
                <br />
                <Form.Select
                    aria-label="ratingGrade"
                    name="ratingGrade"
                    onChange={e => onSelectRatingGrade(e.target.value)}
                >
                    <option>Odaberite ocjenu</option>
                    {[1, 2, 3, 4, 5].map(grade => (
                        <option key={grade} value={grade}>{grade}</option>
                    ))}
                </Form.Select>
                <br />
                <Button variant="primary" onClick={addNewRating}>Dodaj novu recenziju</Button>
            </div>
        </>
    );
}

export default AddRating
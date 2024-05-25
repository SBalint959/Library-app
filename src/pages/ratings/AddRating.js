import React, { Fragment, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";

function AddRating() {

    const bookId = useParams().bookId
    const [book, setBook] = useState(null);
    const [rating, setRating] = useState({
        score: null,
        review: null,
    })
    const [loading, setLoading] = useState(null);

    useEffect(() => {

        const getBookData = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/books/" + bookId,
                    {
                        method: "GET",
                        mode: "cors",
                        headers: {
                            "Accept": "application/vnd.api+json",
                            "Content-Type": "application/vnd.api+json"
    
                        }
                    });
                let jsonData = await response.json();
                console.log("Books:")
                console.log(jsonData);
                setBook(jsonData.data);
                // console.log(books);
    
            } catch (e) {
                console.log(e)
            }
        }

        getBookData();
        // getReviewData();
    }, [bookId]); 


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
        setRating({ ...rating, score: grade });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!book) {
        return <div>Error loading book data.</div>;
    }


    const { attributes } = book;
    const { title, author, genres, isbn, created_at, average_rating, number_of_copies, pages, ratings } = attributes;
    const genreNames = genres.map(genre => genre.name).join(', ');
    const authorName = `${author.first_name} ${author.last_name}`;
    return (
        <>
            <br />
            <div style={{ margin: "auto", width: "50%" }}>
                
            <h2>{title}</h2> {/* Display book title */}
                {/* <br />
                <Form.Select aria-label="user" onChange={e => console.log(e.target.value)}>
                    <option>Odaberite korisnika</option>
                    {users.map((user, index) => (
                        <option key={index}>{user}</option>
                    ))}
                </Form.Select> */}
                <br />
                <InputGroup className="mb-3">
                    <InputGroup.Text id="basic-addon1">Review</InputGroup.Text>
                    <Form.Control
                        as="textarea"
                        placeholder="Write your review here.."
                        aria-label="reviewText"
                        name="reviewText"
                        aria-describedby="basic-addon1"
                        onChange={e => onChange(e)}
                        value={rating.review}
                    />
                </InputGroup>
                <br />
                <Form.Select
                    aria-label="ratingGrade"
                    name="ratingGrade"
                    onChange={e => onSelectRatingGrade(e.target.value)}
                >
                    <option>Pick a grade</option>
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
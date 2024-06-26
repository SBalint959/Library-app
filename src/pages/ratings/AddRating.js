import React, { Fragment, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

function AddRating() {
    const { bookId } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState(null);
    const [rating, setRating] = useState({
        score: '',
        review: ''
    });
    const [alert, setAlert] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookData = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/books/${bookId}`, {
                    method: 'GET',
                    mode: 'cors',
                    headers: {
                        'Accept': 'application/vnd.api+json',
                        'Content-Type': 'application/vnd.api+json'
                    }
                });
                const jsonData = await response.json();
                setBook(jsonData.data);
                setLoading(false);
            } catch (e) {
                console.log(e);
                setLoading(false);
            }
        };

        fetchBookData();
    }, [bookId]);

    const addNewRating = async () => {
        const body = {
            type: "ratings",
            attributes: {
                score: rating.score,
                review: rating.review,
                user_id: "2",
                book_id: bookId
            },
        };

        try {
            const response = await fetch("http://localhost:3000/api/ratings", {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Accept': 'application/vnd.api+json',
                    'Content-Type': 'application/vnd.api+json'
                },
                body: JSON.stringify({ data: body })
            });
            const jsonData = await response.json();

            if (response.status === 201) {
                setAlert("OK");
                setTimeout(() => navigate(`/catalog/${bookId}/ratings`), 2000); // Redirect to the book page after 2 seconds
            } else {
                setAlert("ERROR");
            }

        } catch (e) {
            console.log(e);
            setAlert("ERROR");
        }
    };

    const onChange = e => {
        setRating({ ...rating, [e.target.name]: e.target.value });
    };

    const onSelectRatingGrade = grade => {
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
                {alert === "OK" && (
                    <Alert key="success" variant="success" role="good-alert">
                        Recenzija uspješno dodana!
                    </Alert>
                )}
                {alert === "ERROR" && (
                    <Alert key="danger" variant="danger" role="bad-alert">
                        Neispravno uneseni podaci!
                    </Alert>
                )}
                <br />
                <InputGroup className="mb-3">
                    <InputGroup.Text id="basic-addon1">Recenzija</InputGroup.Text>
                    <Form.Control
                        as="textarea"
                        placeholder="Napišite svoju recenziju ovdje.."
                        aria-label="review"
                        name="review"
                        aria-describedby="basic-addon1"
                        onChange={onChange}
                        value={rating.review}
                    />
                </InputGroup>
                <br />
                <Form.Select
                    aria-label="score"
                    name="score"
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

export default AddRating;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MDBCol } from "mdbreact";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from "react-bootstrap/Button";
import Alert from 'react-bootstrap/Alert';

function BookRatings() {
    const { bookId } = useParams(); // Get the bookId from the URL params
    const navigate = useNavigate();
    const [book, setBook] = useState(null);
    const [alert, setAlert] = useState(null);
    const [loading, setLoading] = useState(null);

    useEffect(() => {
        const getBookData = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/books/${bookId}`, {
                    method: "GET",
                    mode: "cors",
                    headers: {
                        "Accept": "application/vnd.api+json",
                        "Content-Type": "application/vnd.api+json"
                    }
                });
                const jsonData = await response.json();
                setBook(jsonData.data);
            } catch (e) {
                console.log(e);
            }
        };

        getBookData();
    }, [bookId]);

    const deleteRating = async (ratingId) => {
        if (window.confirm("Are you sure you want to delete this rating?")) {
            try {
                const response = await fetch(`http://localhost:3000/api/ratings/${ratingId}`, {
                    method: 'DELETE',
                    mode: 'cors',
                    headers: {
                        'Accept': 'application/vnd.api+json',
                        'Content-Type': 'application/vnd.api+json'
                    }
                });

                if (response.status === 204) {
                    setAlert({ type: 'success', message: 'Rating deleted successfully!' });
                    setBook({
                        ...book,
                        attributes: {
                            ...book.attributes,
                            ratings: book.attributes.ratings.filter(rating => rating.id !== ratingId)
                        }
                    });
                } else {
                    setAlert({ type: 'danger', message: 'Failed to delete rating!' });
                }
            } catch (e) {
                console.log(e);
                setAlert({ type: 'danger', message: 'Failed to delete rating!' });
            }
        }
    };

    const renderRatingStars = (ratingGrade) => {
        return '★'.repeat(ratingGrade); // Use black star (★) Unicode character
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
            <MDBCol style={{ margin: "auto", width: "50%" }}>
                {book ? <h2>Ratings for "{title}"</h2> : <p>Loading book details...</p>}
            </MDBCol>
            <Row className="justify-content-center">
                <Col md={6}>
                    {alert && (
                        <Alert variant={alert.type}>
                            {alert.message}
                        </Alert>
                    )}
                    <Card>
                        <Card.Body>
                            <Card.Subtitle>{authorName}</Card.Subtitle>
                            <Card.Text>Genre: {genreNames}</Card.Text>
                            <Card.Text>Publication Date: {new Date(created_at).getFullYear()}</Card.Text>
                            <Card.Text>ISBN: {isbn}</Card.Text>
                            <Card.Text>Rating: {parseFloat(average_rating).toFixed(2)}</Card.Text>
                            <Card.Text>Copies: {number_of_copies}</Card.Text>
                            <Card.Text>Pages: {pages}</Card.Text>
                            <Button variant="warning" href={`/catalog/${bookId}`}>Edit</Button>
                        </Card.Body>
                    </Card>
                    <h3 className="mt-4">Ratings</h3>
                    {ratings.map(rating => (
                        <Card key={rating.id} className="mt-2">
                            <Card.Body>
                                <Card.Text>Rating: {renderRatingStars(rating.score)}</Card.Text>
                                <Card.Text>Review: {rating.review}</Card.Text>
                                <Button variant="danger" onClick={() => deleteRating(rating.id)}>Delete</Button>
                                <Button variant="warning" className="ms-2" onClick={() => navigate(`/rating/${rating.id}`)}>Edit</Button>
                            </Card.Body>
                        </Card>
                    ))}
                    <Button variant="primary" href={`/rating/new/${bookId}`}>Add new rating</Button>
                </Col>
            </Row>
        </>
    );
}

export default BookRatings;

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MDBCol, MDBIcon } from "mdbreact";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

import Button from "react-bootstrap/Button";

function BookRatings() {
    const { bookId } = useParams(); // Get the bookId from the URL params
    const [book, setBook] = useState(null);
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

    const renderRatingStars = (ratingGrade) => {
        const stars = '★'.repeat(ratingGrade); // Use black star (★) Unicode character
        return stars;
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!book) {
        return <div>Error loading book data.</div>;
    }

    // useEffect(() => {
    //     console.log("Books (state):", book);
    // });

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
                <Card>
                    <Card.Body>
                        <Card.Subtitle>{authorName}</Card.Subtitle>
                        <Card.Text>Genre: {genreNames}</Card.Text>
                        <Card.Text>Publication Date: {new Date(created_at).getFullYear()}</Card.Text>
                        <Card.Text>ISBN: {isbn}</Card.Text>
                        <Card.Text>Rating: {average_rating}</Card.Text>
                        <Card.Text>Copies: {number_of_copies}</Card.Text>
                        <Card.Text>Pages: {pages}</Card.Text>
                        <Button variant="warning" href={"/catalog/" + bookId}>Edit</Button>
                    </Card.Body>
                </Card>
                <h3 className="mt-4">Ratings</h3>
                {ratings.map(rating => (
                    <Card key={rating.id} className="mt-2">
                        <Card.Body>
                            <Card.Text>Rating: {renderRatingStars(rating.score)}</Card.Text>
                            <Card.Text>Review: {rating.review}</Card.Text>
                        </Card.Body>
                    </Card>
                ))}
                <Button variant="primary" href={"/rating/new/" + bookId}>Add new rating</Button>
            </Col>
        </Row>
        </>
    );
}

export default BookRatings;

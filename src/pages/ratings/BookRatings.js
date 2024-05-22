import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MDBCol, MDBIcon } from "mdbreact";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

function BookRatings() {
    const { bookId } = useParams(); // Get the bookId from the URL params
    const [book, setBook] = useState(null);
    const [ratings, setRatings] = useState([]);

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

    const ratingsData = {
        1: [
            {
                reviewText: "An amazing book!",
                ratingGrade: 5,
                user: { name: "Alice" }
            },
            {
                reviewText: "Really enjoyed it.",
                ratingGrade: 4,
                user: { name: "Bob" }
            }
        ],
        2: [
            {
                reviewText: "A thought-provoking read.",
                ratingGrade: 5,
                user: { name: "Charlie" }
            }
        ],
        3: [
            {
                reviewText: "A bit long, but worth it.",
                ratingGrade: 4,
                user: { name: "Dave" }
            }
        ],
        4: [
            {
                reviewText: "A timeless classic.",
                ratingGrade: 5,
                user: { name: "Eve" }
            }
        ],
        5: [
            {
                reviewText: "A captivating story.",
                ratingGrade: 5,
                user: { name: "Frank" }
            }
        ]
    };

    useEffect(() => {

        // const getBookData = async () => {
        //     try {
        //         const response = await fetch("http://localhost:8080/api/books/" + bookId,
        //             {
        //                 method: "GET",
        //                 mode: "cors",
        //                 headers: {
        //                     "Content-type": "application/json"
        //                 }
        //             });
        //         let jsonData = await response.json();
        //         console.log(jsonData);
        //         setBook({ ...jsonData, genreName: jsonData.genre.genreName })
    
        //     } catch (e) {
        //         console.log(e)
        //     }
        // }

        // const getReviewData = async () => {
        //     try {
        //         const response = await fetch("http://localhost:8080/api/ratings/" + bookId,
        //             {
        //                 method: "GET",
        //                 mode: "cors",
        //                 headers: {
        //                     "Content-type": "application/json"
        //                 }
        //             });
        //         let jsonData = await response.json();
        //         console.log(jsonData);
        //         setRatings(jsonData);
    
        //     } catch (e) {
        //         console.log(e)
        //     }
            
        // };
        const fetchBookAndRatings = () => {
            const bookData = books[bookId];
            const ratingsDataForBook = ratingsData[bookId] || [];
            setBook(bookData);
            setRatings(ratingsDataForBook);
        };

        fetchBookAndRatings();

        // getBookData();
        // getReviewData();
    }, [bookId]); 

    const renderRatingStars = (ratingGrade) => {
        const stars = '★'.repeat(ratingGrade); // Use black star (★) Unicode character
        return stars;
    };

    return (
        <>
            <MDBCol style={{ margin: "auto", width: "50%" }}>
                {book ? <h2>Ratings for "{book.bookTitle}"</h2> : <p>Loading book details...</p>}
            </MDBCol>
            <Row xs={1} md={5} className="g-4">
                {ratings.length === 0 ? (
                    <Col>
                        <p>No ratings found for this book.</p>
                    </Col>
                ) : (
                    ratings.map((rating, index) => (
                        <Col key={index}>
                            <Card style={{ width: '18rem' }}>
                                <Card.Body>
                                    <Card.Text>{rating.reviewText}</Card.Text>
                                    <Card.Text>Rating: {renderRatingStars(rating.ratingGrade)}</Card.Text>
                                    <Card.Text>User: {rating.user.name}</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                )}
            </Row>
        </>
    );
}

export default BookRatings;

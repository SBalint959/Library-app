import React, { Fragment, useState, useEffect } from "react";
import Card from 'react-bootstrap/Card';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { MDBCol, MDBIcon } from "mdbreact";

function BooksList() {

    const [search, setSearch] = useState("")

    // const [books, setBooks] = useState([])

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

    // const getBooks = async () => {
    //     try {
    //         const response = await fetch("http://localhost:8080/api/books",
    //             {
    //                 method: "GET",
    //                 mode: "cors",
    //                 headers: {
    //                     "Content-type": "application/json"
    //                 }
    //             });
    //         let jsonData = await response.json();
    //         console.log(jsonData);
    //         setBooks(jsonData)

    //     } catch (e) {
    //         console.log(e)
    //     }
    // }

    // const searchBooks = (inputString) => {
    //     setSearch(books.filter((book) => book.booktitle.toLowerCase().includes(inputString)))
    // }

    //Dev search
    const searchBooks = (query) => {
        if (query === "") {
            setSearch(null);
        } else {
            const filteredBooks = Object.values(books).filter(book =>
                book.bookTitle.toLowerCase().includes(query.toLowerCase())
            );
            setSearch(filteredBooks);
        }
    };

    const deleteBook = async (bookId) => {
        if (window.confirm("Jeste li sigurni da želite izbrisati knjigu: " + bookId)) {
            try {
                const response = await fetch("http://localhost:8080/api/books/" + bookId,
                    {
                        method: "DELETE",
                        mode: "cors",
                        headers: {
                            "Content-type": "application/json"
                        }
                    });
                let jsonData = await response.json();
                // getBooks()
            } catch (e) {
                console.log(e)
            }
        }
    }

    // useEffect(() => {
    //     getBooks();
    // }, []);

    return (
        <>
            <MDBCol style={{
                margin: "auto",
                width: "50%"
            }}>
                <h2>Katalog</h2>
                <form className="form-inline mt-4 mb-4" >
                    <MDBIcon icon="search" />
                    <input className="form-control form-control-sm ml-3 w-99" type="text" placeholder="Pretraga po naslovu" aria-label="Search" onChange={e => searchBooks(e.target.value)} />
                </form>
            </MDBCol>
            <Row xs={1} md={5} className="g-4">
                {!search ? <>{Object.values(books).map((book) => {
                    return (<>
                        <Col>
                            <Card style={{ width: '18rem' }}>
                                <Card.Body>
                                    <Card.Title>{book.bookTitle}</Card.Title>
                                    <Card.Subtitle>{book.bookauthor}</Card.Subtitle>
                                    <Card.Text>
                                        Žanr: {book.genre.genreName}
                                    </Card.Text>
                                    <Card.Text>
                                        Godina publikacije: {book.publicationyear} god.
                                    </Card.Text>
                                    <Card.Text>
                                        ISBN: {book.isbn}
                                    </Card.Text>
                                    <Button variant="warning" className="me-2" href={"/catalog/" + book.bookId}>Uredi</Button>
                                    <Button variant="danger" onClick={() => deleteBook(book.bookId)}>Obriši</Button>
                                </Card.Body>
                            </Card>
                        </Col></>)
                })}</> : <>{Object.values(search).map((book) => {
                    return (<>
                        <Col>
                            <Card style={{ width: '18rem' }}>
                                <Card.Body>
                                    <Card.Title>{book.bookTitle}</Card.Title>
                                    <Card.Subtitle>{book.bookauthor}</Card.Subtitle>
                                    <Card.Text>
                                        Žanr: {book.genre.genreName}
                                    </Card.Text>
                                    <Card.Text>
                                        Godina publikacije: {book.publicationyear} god.
                                    </Card.Text>
                                    <Card.Text>
                                        ISBN: {book.isbn}
                                    </Card.Text>
                                    <Button variant="warning" className="me-2" href={"/catalog/" + book.bookId}>Uredi</Button>
                                    <Button variant="danger" onClick={() => deleteBook(book.bookId)}>Obriši</Button>
                                </Card.Body>
                            </Card>
                        </Col></>)
                })}</>}
                <div style={{
                    width: "20%",
                    height: "20%"
                }}>
                    <Button href="/catalog/new">Dodaj novu knjigu</Button>
                </div>
            </Row>
        </>
    )

}

export default BooksList
import React, { Fragment, useState, useEffect } from "react";
import Card from 'react-bootstrap/Card';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { MDBCol, MDBIcon } from "mdbreact";

function CarsList() {

    const [cars, setCars] = useState([])
    const [search, setSearch] = useState("")

    const [books, setBooks] = useState([])

    const getCars = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/models/deepaccess",
                {
                    method: "GET",
                    mode: "cors",
                    headers: {
                        "Content-type": "application/json"
                    }
                });
            let jsonData = await response.json();
            console.log(jsonData);
            setCars(jsonData)

        } catch (e) {
            console.log(e)
        }
    }
    const getBooks = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/books",
                {
                    method: "GET",
                    mode: "cors",
                    headers: {
                        "Content-type": "application/json"
                    }
                });
            let jsonData = await response.json();
            console.log(jsonData);
            setBooks(jsonData)

        } catch (e) {
            console.log(e)
        }
    }

    const searchBooks = (inputString) => {
        setSearch(books.filter((book) => book.booktitle.toLowerCase().includes(inputString)))
    }

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
                getBooks()
            } catch (e) {
                console.log(e)
            }
        }
    }

    useEffect(() => {
        getBooks();
    }, []);

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

export default CarsList
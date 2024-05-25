import React, { Fragment, useState, useEffect } from "react";
import Card from 'react-bootstrap/Card';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { MDBCol, MDBIcon } from "mdbreact";

function BooksList() {

    const [search, setSearch] = useState("")

    const [books, setBooks] = useState([])
    
    const [expandedBook, setExpandedBook] = useState(null);

    const getBooks = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/books",
                {
                    method: "GET",
                    mode: "cors",
                    headers: {
                        "Accept": "application/vnd.api+json",
                        "Content-Type": "application/vnd.api+json"

                    }
                });
            let jsonData = await response.json();
            // console.log("Books:")
            // console.log(jsonData);
            setBooks(jsonData.data);
            // console.log(books);

        } catch (e) {
            console.log(e)
        }
    }
    

    //Dev search
    const searchBooks = (query) => {
        if (query === "") {
            setSearch(null);
        } else {
            const filteredBooks = books.filter(book =>
                book.attributes.title.toLowerCase().includes(query.toLowerCase())
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

    const toggleExpand = (bookId) => {
        setExpandedBook(expandedBook === bookId ? null : bookId);
    };

    useEffect(() => {
        getBooks();
    }, []);

    useEffect(() => {
        console.log("Books (state):", books);
    }, [books]);

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
                    const { id, attributes } = book;
                    const { title, author, genres, isbn, created_at, updated_at, average_rating, number_of_copies, pages } = attributes;
                    const genreNames = genres.map(genre => genre.name).join(', ');
                    const authorName = `${author.first_name} ${author.last_name}`;
                    const isExpanded = expandedBook === id;
                    return (<>
                        <Col key={id}>
                            <Card style={{ width: '18rem' }} onClick={() => toggleExpand(id)}>
                                <Card.Body>
                                    <Card.Title>{title}</Card.Title>
                                    <Card.Subtitle>{authorName}</Card.Subtitle>
                                    {isExpanded && (
                                        <>
                                            <Card.Text>Genre: {genreNames}</Card.Text>
                                            <Card.Text>ISBN: {isbn}</Card.Text>
                                            <Card.Text>Rating: {average_rating}</Card.Text>
                                            <Card.Text>Copies: {number_of_copies}</Card.Text>
                                            <Card.Text>Pages: {pages}</Card.Text>
                                            <Button variant="primary" className="me-2" href={"/catalog/" + id + "/ratings"}>Ratings</Button>
                                            <Button variant="warning" className="me-2" href={"/catalog/" + id}>Edit</Button>
                                            <Button variant="danger" onClick={(e) => { e.stopPropagation(); deleteBook(id); }}>Delete</Button>
                                        </>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col></>)
                })}</> : <>{Object.values(search).map((book) => {
                    const { id, attributes } = book;
                    const { title, author, genres, isbn, created_at, updated_at, average_rating, number_of_copies, pages } = attributes;
                    const genreNames = genres.map(genre => genre.name).join(', ');
                    const authorName = `${author.first_name} ${author.last_name}`;
                    const isExpanded = expandedBook === id;
                    return (<>
                        <Col key={id}>
                            <Card style={{ width: '18rem' }} onClick={() => toggleExpand(id)}>
                                <Card.Body>
                                    <Card.Title>{title}</Card.Title>
                                    <Card.Subtitle>{authorName}</Card.Subtitle>
                                    {isExpanded && (
                                        <>
                                            <Card.Text>Genre: {genreNames}</Card.Text>
                                            <Card.Text>ISBN: {isbn}</Card.Text>
                                            <Card.Text>Rating: {average_rating}</Card.Text>
                                            <Card.Text>Copies: {number_of_copies}</Card.Text>
                                            <Card.Text>Pages: {pages}</Card.Text>
                                            <Button variant="warning" className="me-2" href={"/catalog/" + id}>Edit</Button>
                                            <Button variant="danger" onClick={(e) => { e.stopPropagation(); deleteBook(id); }}>Delete</Button>
                                        </>
                                    )}
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
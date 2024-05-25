import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

function BookView() {
    let navigate = useNavigate();
    const { bookId } = useParams();
    const [book, setBook] = useState(null);
    const [alert, setAlert] = useState(null);
    const [invalidInputs, setInvalidInputs] = useState([]);
    const [genres, setGenres] = useState([]);
    const [authors, setAuthors] = useState([]);
    const [selectedAuthor, setSelectedAuthor] = useState('');

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
                setBook(jsonData.data.attributes);
                setSelectedAuthor(jsonData.data.attributes.author_id);
            } catch (e) {
                console.log(e);
            }
        };

        const fetchGenres = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/genres", {
                    method: 'GET',
                    mode: 'cors',
                    headers: {
                        'Accept': 'application/vnd.api+json',
                        'Content-Type': 'application/vnd.api+json'
                    }
                });
                const jsonData = await response.json();
                setGenres(jsonData.data);
            } catch (e) {
                console.log(e);
            }
        };

        const fetchAuthors = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/authors", {
                    method: 'GET',
                    mode: 'cors',
                    headers: {
                        'Accept': 'application/vnd.api+json',
                        'Content-Type': 'application/vnd.api+json'
                    }
                });
                const jsonData = await response.json();
                setAuthors(jsonData.data);
            } catch (e) {
                console.log(e);
            }
        };

        fetchBookData();
        fetchGenres();
        fetchAuthors();
    }, [bookId]);

    const setBookData = async () => {
        const selectedGenres = genres.filter(genre => book.genreNames.includes(genre.attributes.name));
        const genreIds = selectedGenres.map(genre => genre.id);

        const bookBody = {
            title: book.title,
            author_id: selectedAuthor, // Use the selected author's ID
            isbn: book.isbn,
            publication_year: book.publication_year,
            number_of_copies: book.number_of_copies,
            number_of_pages: book.number_of_pages,
            genres: genreIds
        };

        try {
            // Update the book with the selected author ID
            const bookResponse = await fetch(`http://localhost:3000/api/books/${bookId}`, {
                method: 'PATCH',
                mode: 'cors',
                headers: {
                    'Accept': 'application/vnd.api+json',
                    'Content-Type': 'application/vnd.api+json'
                },
                body: JSON.stringify({ data: { attributes: bookBody } })
            });

            const bookJsonData = await bookResponse.json();

            if (bookResponse.status === 200) {
                setAlert("OK");
            } else {
                setAlert("ERROR");
                setInvalidInputs(bookJsonData.errors.map(error => error.source.pointer.replace('/data/attributes/', '')));
            }

        } catch (e) {
            console.log(e);
        }
    };

    const deleteBook = async () => {
        if (window.confirm("Jeste li sigurni da želite izbrisati knjigu: " + bookId)) {
            try {
                const response = await fetch(`http://localhost:3000/api/books/${bookId}`, {
                    method: 'DELETE',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (response.status === 204) {
                    navigate("/catalog");
                } else {
                    console.error("Failed to delete the book");
                }
            } catch (e) {
                console.log(e);
            }
        }
    };

    const onChange = e => {
        const { name, value } = e.target;
        setBook({ ...book, [name]: value });
    };

    return book ? (
        <div style={{ margin: 'auto', width: '50%' }}>
            <h1>Uređivanje knjige {book.title}</h1>
            {alert === "OK" && (
                <Alert key="success" variant="success">
                    Uspješno ažurirano!
                </Alert>
            )}
            {alert === "ERROR" && (
                <Alert key="danger" variant="danger">
                    Neispravno uneseni podaci! {invalidInputs.join(", ")}
                </Alert>
            )}
            <br />
            <Form>
                <Form.Text id="passwordHelpBlock" muted>
                    Obavezan unos.
                </Form.Text>
                <InputGroup className="mb-3">
                    <InputGroup.Text id="basic-addon1">Naslov knjige</InputGroup.Text>
                    <Form.Control
                        placeholder="Naslov"
                        aria-label="title"
                        name="title"
                        aria-describedby="basic-addon1"
                        onChange={onChange}
                        value={book.title}
                    />
                </InputGroup>
                <Form.Text id="passwordHelpBlock" muted>
                    Obavezan odabir autora.
                </Form.Text>
                <InputGroup className="mb-3">
                    <InputGroup.Text id="basic-addon1">Autor</InputGroup.Text>
                    <Form.Select aria-label="author" name="author" value={selectedAuthor} onChange={e => setSelectedAuthor(e.target.value)}>
                        <option>Odaberite autora</option>
                        {authors.map((author) => (
                            <option key={author.id} value={author.id}>
                                {author.attributes.first_name} {author.attributes.last_name}
                            </option>
                        ))}
                    </Form.Select>
                    <Button variant="primary" className="ms-2" onClick={() => navigate("/authors/new")}>Dodaj autora</Button>
                </InputGroup>
                <Form.Text id="passwordHelpBlock" muted>
                    Obavezan odabir.
                </Form.Text>
                <Form.Select aria-label="genre" name="genreNames" value={book.genreNames} onChange={e => onChange(e)} multiple>
                    <option>Odaberite žanr</option>
                    {genres.map((genre) => (
                        <option key={genre.id} value={genre.attributes.name}>{genre.attributes.name}</option>
                    ))}
                </Form.Select>
                <br />
                <Form.Text id="passwordHelpBlock" muted>
                    Obavezan unos.
                </Form.Text>
                <InputGroup className="mb-3">
                    <InputGroup.Text id="basic-addon1">ISBN</InputGroup.Text>
                    <Form.Control
                        placeholder="ISBN kod"
                        aria-label="isbn"
                        name="isbn"
                        aria-describedby="basic-addon1"
                        onChange={onChange}
                        value={book.isbn}
                    />
                </InputGroup>
                <InputGroup className="mb-3">
                    <InputGroup.Text id="basic-addon1">Broj stranica</InputGroup.Text>
                    <Form.Control
                        placeholder="Broj stranica"
                        aria-label="number_of_pages"
                        name="number_of_pages"
                        aria-describedby="basic-addon1"
                        onChange={onChange}
                        value={book.number_of_pages}
                    />
                </InputGroup>
                <InputGroup className="mb-3">
                    <InputGroup.Text id="basic-addon1">Broj primjeraka</InputGroup.Text>
                    <Form.Control
                        placeholder="Broj primjeraka"
                        aria-label="number_of_copies"
                        name="number_of_copies"
                        aria-describedby="basic-addon1"
                        onChange={onChange}
                        value={book.number_of_copies}
                    />
                </InputGroup>
                <div style={{ margin: 'auto', width: '40%' }}>
                    <Button variant="success" onClick={setBookData} className="me-2">Spremi promjene</Button>
                    <Button variant="danger" onClick={deleteBook}>Obriši</Button>
                </div>
                <br />
            </Form>
        </div>
    ) : (
        <div>Loading...</div>
    );
}

export default BookView;

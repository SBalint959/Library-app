import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

const AddBook = () => {
    const navigate = useNavigate();
    const [book, setBook] = useState({
        title: '',
        isbn: '',
        number_of_copies: '',
        pages: '',
        genres: []
    });
    const [alert, setAlert] = useState(null);
    const [invalidInputs, setInvalidInputs] = useState([]);
    const [genres, setGenres] = useState([]); // This should be fetched from the API
    const [authors, setAuthors] = useState([]); // List of authors fetched from the API
    const [selectedAuthor, setSelectedAuthor] = useState(''); // Selected author ID

    useEffect(() => {
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

        fetchGenres();
        fetchAuthors();
    }, []);

    const onChange = (e) => {
        const { name, value } = e.target;
        setBook({ ...book, [name]: value });
    };

    const onGenreChange = (e) => {
        const selectedGenres = Array.from(e.target.selectedOptions, option => option.value);
        setBook({ ...book, genres: selectedGenres });
        console.log(selectedGenres)
    };

    const addBook = async () => {
        try {
            const genreIds = genres
                .filter(genre => book.genres.includes(genre.attributes.name))
                .map(genre => ({ type: 'genres', id: genre.id }));

            const body = {
                type: "books",
                attributes: {
                    title: book.title,
                    isbn: book.isbn,
                    number_of_copies: book.number_of_copies,
                    pages: book.pages,
                    published_at: "2015-04-10",
                },
                relationships: {
                    author: {
                        data: {
                            type: 'authors',
                            id: selectedAuthor
                        }
                    },
                    genres: {
                        data: genreIds
                    }
                }
            }; 
            console.log(body)

            const bookResponse = await fetch("http://localhost:3000/api/books", {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Accept': 'application/vnd.api+json',
                    'Content-Type': 'application/vnd.api+json'
                },
                body: JSON.stringify({ data: body })
            });

            if (!bookResponse.ok) {
                throw new Error('Failed to save book');
            }
            

            const jsonData = await bookResponse.json();
            console.log(jsonData);

            setAlert("OK");
            setTimeout(() => navigate("/catalog"), 2000); // Redirect to catalog after 2 seconds

        } catch (e) {
            console.log(e);
            setAlert("ERROR");
            setInvalidInputs(["author", "book"]);
        }
    };

    return (
        <div style={{ margin: 'auto', width: '50%' }}>
            <h1>Dodavanje nove knjige</h1>
            {alert === "OK" && (
                <Alert key="success" variant="success" role="good-alert">
                    Knjiga uspješno dodana!
                </Alert>
            )}
            {alert === "ERROR" && (
                <Alert key="danger" variant="danger" role="bad-alert">
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
                    Obavezan unos.
                </Form.Text>
                <InputGroup className="mb-3">
                    <InputGroup.Text id="basic-addon1">Autor</InputGroup.Text>
                    <Form.Select aria-label="author" name="author" onChange={e => setSelectedAuthor(e.target.value)}>
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
                <Form.Select aria-label="genres" name="genres" value={book.genres} onChange={onGenreChange} multiple>
                    <option>Odaberite žanr</option>
                    {genres.map((genre) => (
                        <option key={genre.id} value={genre.attributes.name}>{genre.attributes.name}</option>
                    ))}
                </Form.Select>
                <br />
                <Form.Text id="passwordHelpBlock" muted>
                    Obavezan unos. Mora biti duljine 10 ili 13.
                    (048665088X, 9780743273565, 0-19-953556-6)
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
                <br/>
                <InputGroup className="mb-3">
                    <InputGroup.Text id="basic-addon1">Broj stranica</InputGroup.Text>
                    <Form.Control
                        placeholder="Broj stranica"
                        aria-label="pages"
                        name="pages"
                        aria-describedby="basic-addon1"
                        onChange={onChange}
                        value={book.pages}
                    />
                </InputGroup>
                <br />
                <Form.Text id="passwordHelpBlock" muted>
                    Obavezan unos. Barem 2.
                </Form.Text>
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
                    <Button variant="success" onClick={addBook} className="me-2">Dodaj knjigu</Button>
                </div>
                <br />
            </Form>
        </div>
    );
};

export default AddBook;

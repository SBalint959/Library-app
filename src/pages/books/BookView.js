import React, { Fragment, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

function BookView() {
    let navigate = useNavigate()

    const bookId = useParams().bookId;
    const [book, setBook] = useState({
        booktitle: null,
        bookauthor: null,
        isbn: null,
        publicationyear: null,
        genreid: null
    })

    const [genres, setGenres] = useState([])

    let [alert, setAlert] = useState(null)

    const [invalidInputs, setInvalidInputs] = useState(null)

    const getBookData = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/books/" + bookId,
                {
                    method: "GET",
                    mode: "cors",
                    headers: {
                        "Content-type": "application/json"
                    }
                });
            let jsonData = await response.json();
            console.log(jsonData);
            setBook({ ...jsonData, genreName: jsonData.genre.genreName })

        } catch (e) {
            console.log(e)
        }
    }

    const getGenreData = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/genres",
                {
                    method: "GET",
                    mode: "cors",
                    headers: {
                        "Content-type": "application/json"
                    }
                });
            let jsonData = await response.json();
            setGenres(jsonData)

        } catch (e) {
            console.log(e)
        }
    }

    const setBookData = async () => {
        let genreid
        for (let genre of genres) {
            if (genre.genreName === book.genreName) {
                genreid = genre.genreid
                break
            }
        }
        let body = {
            booktitle: book.booktitle,
            bookauthor: book.bookauthor,
            isbn: book.isbn,
            publicationyear: book.publicationyear,
            genreid: genreid
        }
        try {
            const response = await fetch("http://localhost:8080/api/models/" + bookId,
                {
                    method: "PUT",
                    mode: "cors",
                    headers: {
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify(body)
                });
            let jsonData = await response.json();
            console.log(jsonData);
            if (response.status === 200) {
                setAlert("OK")
            } else {
                setAlert("ERROR")
                setInvalidInputs(jsonData.invalidFields)
            }

        } catch (e) {
            console.log(e)
        }

    }

    const deleteBook = async () => {
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
                //let jsonData = await response.json();
                navigate("/catalog")
            } catch (e) {
                console.log(e)
            }
        }
    }
    const onChange = e => {
        setBook({ ...book, [e.target.name]: e.target.value })
    }

    useEffect(() => {
        getBookData();
        getGenreData()
    }, []);

    return (<>
        <br />
        <div style={{
            margin: "auto",
            width: "50%"
        }}>
            <h1>Uređivanje knjige {book.booktitle}</h1>
            {alert === "OK" ? <><Alert key="success" variant="success">
                Uspješno ažurirano!
            </Alert></> : <></>}
            {alert === "ERROR" ? <><Alert key="danger" variant="danger">
                Neispravno uneseni podaci! {invalidInputs.join(", ")}
            </Alert></> : <></>}
            <br />
            <Form.Text id="passwordHelpBlock" muted>
                Obavezan odabir.
            </Form.Text>
            <Form.Select aria-label="genre" name="genrename" value={book.genreName} onChange={e => onChange(e)}>
                <option>Odaberite žanr</option>
                {Object.values(genres).map((genre) => {
                    return (<option>{genre.genrename}</option>)
                })}
            </Form.Select>
            <br />

            <Form.Text id="passwordHelpBlock" muted>
                Obavezan unos.
            </Form.Text>
            <InputGroup className="mb-3">
                <InputGroup.Text id="basic-addon1">Naslov knjige</InputGroup.Text>
                <Form.Control
                    placeholder="Naslov"
                    aria-label="booktitle"
                    name="booktitle"
                    aria-describedby="basic-addon1"
                    onChange={e => onChange(e)}
                    value={book.booktitle}
                />
            </InputGroup>
            <Form.Text id="passwordHelpBlock" muted>
                Obavezan unos.
            </Form.Text>
            <InputGroup className="mb-3">
                <InputGroup.Text id="basic-addon1">Autor</InputGroup.Text>
                <Form.Control
                    placeholder="Ime i prezime autora"
                    aria-label="bookauthor"
                    name="bookauthor"
                    aria-describedby="basic-addon1"
                    onChange={e => onChange(e)}
                    value={book.bookauthor}
                />
            </InputGroup>

            <Form.Text id="passwordHelpBlock" muted>
                Obavezan unos. Format: "2015."
            </Form.Text>
            <InputGroup className="mb-3">
                <InputGroup.Text id="basic-addon1">Godina publikacije</InputGroup.Text>
                <Form.Control
                    placeholder="Godina"
                    aria-label="publicationyear"
                    name="publicationyear"
                    aria-describedby="basic-addon1"
                    onChange={e => onChange(e)}
                    value={book.publicationyear}
                />
            </InputGroup>
            <Form.Text id="passwordHelpBlock" muted>
                Obavezan unos. Mora biti broj veći od 0.
            </Form.Text>

            <InputGroup className="mb-3">
                <InputGroup.Text id="basic-addon1">ISBN</InputGroup.Text>
                <Form.Control
                    placeholder="ISBN kod"
                    aria-label="isbn"
                    name="isbn"
                    aria-describedby="basic-addon1"
                    onChange={e => onChange(e)}
                    value={book.isbn}
                />
            </InputGroup>
            <div style={{
                margin: "auto",
                width: "40%"
            }}>
                <Button variant="success" onClick={() => setBookData()} className="me-2">Spremi promjene</Button>
                <Button variant="danger" onClick={() => deleteBook()}>Obriši</Button>
            </div>
            <br />
        </div>
    </>)

}

export default BookView
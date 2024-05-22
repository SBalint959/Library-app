import React, { Fragment, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

function AddBook() {
    let navigate = useNavigate()

    const [book, setBook] = useState({
        booktitle: null,
        bookauthor: null,
        isbn: null,
        publicationyear: null,
        genreid: null
    })


    let [genres, setGenres] = useState([])
    const [invalidInputs, setInvalidInputs] = useState(null)

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

    const addNewBook = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/books/",
                {
                    method: "POST",
                    mode: "cors",
                    headers: {
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify(book)
                });
            let jsonData = await response.json();
            console.log(jsonData);
            if (response.status === 400) {
                setInvalidInputs(jsonData.invalidFields)
            } else {
                navigate("/catalog/" + jsonData.bookid)
            }

        } catch (e) {
            console.log(e)
        }

    }
    const onChange = e => {
        setBook({ ...book, [e.target.name]: e.target.value })
    };

    useEffect(() => {
        getGenreData()
    }, []);

    const setGenreId = (name) => {
        genres.forEach((genre) => { if (genre.genrename === name) return setBook({ ...book, genreid: genre.genreid }) })
    }

    return (<>
        <br />
        <div style={{
            margin: "auto",
            width: "50%"
        }}>
            <h1>Dodavanje nove knjige</h1>
            {invalidInputs ? <><Alert key="danger" variant="danger">
                Nevaljani unosi: {invalidInputs.join(", ")}
            </Alert></> : <></>}
            <br />
            <Form.Text id="passwordHelpBlock" muted>
                Obavezan odabir.
            </Form.Text>
            <Form.Select aria-label="genre" name="genrename" onChange={e => setGenreId(e.target.value)}>
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


            <Button variant="primary" onClick={() => addNewBook()}>Dodaj knjigu</Button>
        </div>
    </>)

}

export default AddBook
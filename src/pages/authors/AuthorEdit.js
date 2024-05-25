import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

function AuthorEdit() {
    const { authorId } = useParams();
    const navigate = useNavigate();
    const [author, setAuthor] = useState({
        first_name: '',
        last_name: '',
        biography: ''
    });
    const [alert, setAlert] = useState(null);
    const [invalidInputs, setInvalidInputs] = useState([]);

    useEffect(() => {
        const fetchAuthorData = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/authors/${authorId}`, {
                    method: 'GET',
                    mode: 'cors',
                    headers: {
                        'Accept': 'application/vnd.api+json',
                        'Content-Type': 'application/vnd.api+json'
                    }
                });
                const jsonData = await response.json();
                setAuthor(jsonData.data.attributes);
            } catch (e) {
                console.log(e);
            }
        };

        fetchAuthorData();
    }, [authorId]);

    const onChange = (e) => {
        const { name, value } = e.target;
        setAuthor({ ...author, [name]: value });
    };

    const updateAuthor = async () => {
        const body = {
            first_name: author.first_name,
            last_name: author.last_name,
            biography: author.biography
        };

        try {
            const response = await fetch(`http://localhost:3000/api/authors/${authorId}`, {
                method: 'PATCH',
                mode: 'cors',
                headers: {
                    'Accept': 'application/vnd.api+json',
                    'Content-Type': 'application/vnd.api+json'
                },
                body: JSON.stringify({ data: { attributes: body } })
            });
            const jsonData = await response.json();

            if (response.status === 200) {
                setAlert("OK");
                setTimeout(() => navigate("/authors"), 2000); // Redirect to authors list after 2 seconds
            } else {
                setAlert("ERROR");
                setInvalidInputs(jsonData.errors.map(error => error.source.pointer.replace('/data/attributes/', '')));
            }

        } catch (e) {
            console.log(e);
        }
    };

    return (
        <div style={{ margin: 'auto', width: '50%' }}>
            <h1>Uređivanje autora</h1>
            {alert === "OK" && (
                <Alert key="success" variant="success">
                    Autor uspješno ažuriran!
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
                    <InputGroup.Text id="basic-addon1">Ime autora</InputGroup.Text>
                    <Form.Control
                        placeholder="Ime"
                        aria-label="first_name"
                        name="first_name"
                        aria-describedby="basic-addon1"
                        onChange={onChange}
                        value={author.first_name}
                    />
                </InputGroup>
                <Form.Text id="passwordHelpBlock" muted>
                    Obavezan unos.
                </Form.Text>
                <InputGroup className="mb-3">
                    <InputGroup.Text id="basic-addon1">Prezime autora</InputGroup.Text>
                    <Form.Control
                        placeholder="Prezime"
                        aria-label="last_name"
                        name="last_name"
                        aria-describedby="basic-addon1"
                        onChange={onChange}
                        value={author.last_name}
                    />
                </InputGroup>
                <Form.Text id="passwordHelpBlock" muted>
                    Obavezan unos.
                </Form.Text>
                <InputGroup className="mb-3">
                    <InputGroup.Text id="basic-addon1">Biografija autora</InputGroup.Text>
                    <Form.Control
                        as="textarea"
                        rows={5}
                        placeholder="Biografija"
                        aria-label="biography"
                        name="biography"
                        aria-describedby="basic-addon1"
                        onChange={onChange}
                        value={author.biography}
                    />
                </InputGroup>
                <div style={{ margin: 'auto', width: '40%' }}>
                    <Button variant="success" onClick={updateAuthor} className="me-2">Spremi promjene</Button>
                    <Button variant="secondary" onClick={() => navigate("/authors")}>Odustani</Button>
                </div>
                <br />
            </Form>
        </div>
    );
}

export default AuthorEdit;

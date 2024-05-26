import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { MDBCol, MDBIcon } from "mdbreact";

function AuthorsList() {
    const [authors, setAuthors] = useState([]);
    const [search, setSearch] = useState('');
    const [filteredAuthors, setFilteredAuthors] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
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
                setFilteredAuthors(jsonData.data);
            } catch (e) {
                console.log(e);
            }
        };

        fetchAuthors();
    }, []);

    const searchAuthors = (query) => {
        setSearch(query);
        if (query === "") {
            setFilteredAuthors(authors);
        } else {
            const filtered = authors.filter(author =>
                author.attributes.first_name.toLowerCase().includes(query.toLowerCase()) ||
                author.attributes.last_name.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredAuthors(filtered);
        }
    };

    const deleteAuthor = async (authorId) => {
        if (window.confirm("Jeste li sigurni da želite izbrisati autora: " + authorId + "?")) {
            try {
                const response = await fetch(`http://localhost:3000/api/authors/${authorId}`, {
                    method: 'DELETE',
                    mode: 'cors',
                    headers: {
                        'Accept': 'application/vnd.api+json',
                        'Content-Type': 'application/vnd.api+json'
                    }
                });
                if (response.status === 204) {
                    setAuthors(authors.filter(author => author.id !== authorId));
                    setFilteredAuthors(filteredAuthors.filter(author => author.id !== authorId));
                } else {
                    console.error("Failed to delete the author");
                }
            } catch (e) {
                console.log(e);
            }
        }
    };

    return (
        <div style={{ margin: 'auto', width: '80%' }}>
            <h1>Popis autora</h1>
            <MDBCol style={{ margin: "auto", width: "50%" }}>
                <form className="form-inline mt-4 mb-4">
                    <MDBIcon icon="search" />
                    <input
                        className="form-control form-control-sm ml-3 w-99"
                        type="text"
                        placeholder="Pretraga po imenu ili prezimenu"
                        aria-label="Search"
                        onChange={e => searchAuthors(e.target.value)}
                        value={search}
                    />
                </form>
            </MDBCol>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Ime</th>
                        <th>Prezime</th>
                        <th>Biografija</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {filteredAuthors.map((author) => {
                        return (
                            <tr key={author.id}>
                                <td>{author.attributes.first_name}</td>
                                <td>{author.attributes.last_name}</td>
                                <td>{author.attributes.biography}</td>
                                <td>
                                    <Button variant="warning" className="me-2" href={"/authors/" + author.id}>Uredi</Button>
                                    <Button variant="danger" onClick={() => deleteAuthor(author.id)}>Obriši</Button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
            <div style={{ margin: 'auto', width: '20%', textAlign: 'center' }}>
                <Button variant="primary" onClick={() => navigate("/authors/new")}>Dodaj novog autora</Button>
            </div>
        </div>
    );
}

export default AuthorsList;

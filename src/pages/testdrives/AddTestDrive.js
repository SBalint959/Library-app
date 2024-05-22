import React, { Fragment, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";

function AddTestDrive() {
    const [testDrive, setTestDrive] = useState({
        testdrivetime: null,
        stockid: null,
        userid: null
    })

    let stock = ["Civic Type R", "Taycan", "Focus Titanium"]
    let users = ["Mirko", "Stanko"]

    const addNewTestDrive = async () => {
        try {
            const response = await fetch("http://localhost:5000/testdrives/add",
                {
                    method: "POST",
                    mode: "cors",
                    headers: {
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify(testDrive)
                });
            let jsonData = await response.json();
            console.log(jsonData);

        } catch (e) {
            console.log(e)
        }

    }
    const onChange = e => {
        setTestDrive({ ...testDrive, [e.target.name]: e.target.value })
    };

    return (<>
        <br />
        <div style={{
            margin: "auto",
            width: "50%"
        }}>
            <Dropdown>
                <Dropdown.Toggle variant="primary" id="dropdown-basic">
                    Dropdown Button
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    {Object.values(stock).map((maker) => {
                        return (<Dropdown.Item href="#/action-1">{maker}</Dropdown.Item>)
                    })}
                </Dropdown.Menu>
            </Dropdown>
            <br />
            <Form.Select aria-label="stock" onChange={e => console.log(e.target.value)}>
                <option>Odaberite dostupno na zalihi</option>
                {Object.values(stock).map((st) => {
                    return (<option>{st}</option>)
                })}
            </Form.Select>
            <br />
            <Form.Select aria-label="user" onChange={e => console.log(e.target.value)}>
                <option>Odaberite korisnika</option>
                {Object.values(users).map((user) => {
                    return (<option>{user}</option>)
                })}
            </Form.Select>
            <br />

            <InputGroup className="mb-3">
                <InputGroup.Text id="basic-addon1">Vrijeme</InputGroup.Text>
                <Form.Control
                    placeholder="Boja"
                    aria-label="testdrivetime"
                    name="testdrivetime"
                    aria-describedby="basic-addon1"
                    onChange={e => onChange(e)}
                    value={testDrive.testdrivetime}
                />
            </InputGroup>
            <Button variant="primary" onClick={addNewTestDrive()}>Dodaj novu testnu vožnju</Button>
        </div>
    </>)
}

export default AddTestDrive
import React, { Fragment, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from "react-bootstrap/Button";
import Alert from 'react-bootstrap/Alert';

function AddUser() {
    let navigate = useNavigate()
    const [user, setUser] = useState({
        username: null,
        usersurname: null,
        oib: null,
        roleid: null
    })
    const [invalidInputs, setInvalidInputs] = useState(null)

    let [roles, setRoles] = useState([])

    const addNewUser = async () => {
        console.log(user)
        try {
            const response = await fetch("http://localhost:8080/api/users",
                {
                    method: "POST",
                    mode: "cors",
                    headers: {
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify(user)
                });
            if (response.status === 200) {
                let jsonData = await response.json();
                console.log(jsonData);
                navigate("/users/" + jsonData.userid)
            } else if (response.status === 400) {
                let jsonData = await response.json()
                setInvalidInputs(jsonData.invalidFields)
            }



        } catch (e) {
            console.log(e)
        }

    }

    const getRolesData = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/roles",
                {
                    method: "GET",
                    mode: "cors",
                    headers: {
                        "Content-type": "application/json"
                    }
                });
            let jsonData = await response.json();
            console.log(jsonData);
            setRoles(jsonData)

        } catch (e) {
            console.log(e)
        }
    }
    const onChange = e => {
        setUser({ ...user, [e.target.name]: e.target.value })
    };
    useEffect(() => {
        getRolesData();
    }, []);

    const setRoleId = (name) => {
        roles.forEach((role) => { if (role.rolename === name) return setUser({ ...user, roleid: role.roleid }) })
    }

    return (<>
        <br />
        <div style={{
            margin: "auto",
            width: "50%"
        }}>
            <h1>Dodavanje novog korisnika</h1>
            {invalidInputs ? <><Alert key="danger" variant="danger">
                Neavljani unosi: {invalidInputs.join(", ")}
            </Alert></> : <></>}
            <br />
            <Form.Text id="passwordHelpBlock" muted>
                Obavezno odabrati.
            </Form.Text>
            <Form.Select aria-label="roles" onChange={e => setRoleId(e.target.value)}>
                <option>Odaberite ulogu</option>
                {Object.values(roles).map((role) => {
                    return (<option>{role.rolename}</option>)
                })}
            </Form.Select>
            <br />
            <Form.Text id="passwordHelpBlock" muted>
                Obavezan unos. Smije sadržavati samo slova.
            </Form.Text>
            <InputGroup className="mb-3">
                <InputGroup.Text id="basic-addon1">Ime korisnika</InputGroup.Text>
                <Form.Control
                    placeholder="Ime"
                    aria-label="username"
                    name="username"
                    aria-describedby="basic-addon1"
                    onChange={e => onChange(e)}
                    value={user.username}
                />
            </InputGroup>
            <Form.Text id="passwordHelpBlock" muted>
                Obavezan unos. Smije sadržavati samo slova.
            </Form.Text>
            <InputGroup className="mb-3">
                <InputGroup.Text id="basic-addon1">Prezime korisnika</InputGroup.Text>
                <Form.Control
                    placeholder="Prezime"
                    aria-label="usersurname"
                    name="usersurname"
                    aria-describedby="basic-addon1"
                    onChange={e => onChange(e)}
                    value={user.usersurname}
                />
            </InputGroup>
            <Form.Text id="passwordHelpBlock" muted>
                Neobavezan unos. Mora biti validan OIB.
            </Form.Text>
            <InputGroup className="mb-3">
                <InputGroup.Text id="basic-addon1">OIB korisnika</InputGroup.Text>
                <Form.Control
                    placeholder="OIB"
                    aria-label="oib"
                    name="oib"
                    aria-describedby="basic-addon1"
                    onChange={e => onChange(e)}
                    value={user.oib}
                />
            </InputGroup>
            <Button variant="primary" onClick={() => addNewUser()}>Dodaj novog korisnika</Button>
        </div>
    </>)
}

export default AddUser
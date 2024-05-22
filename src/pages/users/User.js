import React, { Fragment, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

function User() {
    let navigate = useNavigate()
    const userId = useParams().userId
    const [user, setUser] = useState({
        userName: null,
        userSurname: null,
        OIB: null,
        roleID: null,
        roleName: null
    })
    let [roles, setRoles] = useState([])
    let [alert, setAlert] = useState(null)
    const [invalidInputs, setInvalidInputs] = useState(null)

    const getUserData = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/users/deepaccess/" + userId,
                {
                    method: "GET",
                    mode: "cors",
                    headers: {
                        "Content-type": "application/json"
                    }
                });
            let jsonData = await response.json();
            console.log(jsonData);
            setUser({ ...jsonData, roleName: jsonData.role.roleName })

        } catch (e) {
            console.log(e)
        }
    }

    const setUserData = async () => {
        let roleID
        for (let role of roles) {
            if (role.rolename === user.roleName) {
                roleID = role.roleid
                break
            }
        }
        let body = {
            username: user.userName,
            usersurname: user.userSurname,
            oib: user.OIB,
            roleid: roleID
        }
        try {
            const response = await fetch("http://localhost:8080/api/users/" + userId,
                {
                    method: "PUT",
                    mode: "cors",
                    headers: {
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify(body)
                });
            let jsonData = await response.json();
            if (response.status === 200)
                setAlert("OK")
            else {
                setAlert("ERROR")
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
            for (let role of roles) {
                if (role.roleid === user.roleid) {
                    setUser({ ...user, rolename: role.rolename })
                }
            }

        } catch (e) {
            console.log(e)
        }
    }

    const deleteUser = async () => {
        if (window.confirm("Jeste li sigurni da želite izbrisati korisnika: " + user.userName)) {
            try {
                const response = await fetch("http://localhost:8080/api/users/" + userId,
                    {
                        method: "DELETE",
                        mode: "cors",
                        headers: {
                            "Content-type": "application/json"
                        }
                    });
                //let jsonData = await response.json();
                navigate("/users")

            } catch (e) {
                console.log(e)
            }
        }
    }
    useEffect(() => {
        getUserData();
        getRolesData()
    }, []);
    const onChange = e => {
        setUser({ ...user, [e.target.name]: e.target.value })
    }

    return (
        <>
            <br />
            <div style={{
                margin: "auto",
                width: "50%"
            }}>
                <br />
                <h1>Uređivanje korisnika {user.userName}</h1>
                {alert === "OK" ? <><Alert key="success" variant="success">
                    Uspješno ažurirano!
                </Alert></> : <></>}
                {alert === "ERROR" ? <><Alert key="danger" variant="danger">
                    Neispravno uneseni podaci! {invalidInputs.join(", ")}
                </Alert></> : <></>}
                <Form.Text id="passwordHelpBlock" muted>
                    Obavezno odabrati.
                </Form.Text>
                <Form.Select aria-label="roles" value={user.roleName} name="roleName" onChange={e => onChange(e)}>
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
                        aria-label="userName"
                        name="userName"
                        aria-describedby="basic-addon1"
                        onChange={e => onChange(e)}
                        value={user.userName}
                    />
                </InputGroup>
                <Form.Text id="passwordHelpBlock" muted>
                    Obavezan unos. Smije sadržavati samo slova.
                </Form.Text>
                <InputGroup className="mb-3">
                    <InputGroup.Text id="basic-addon1">Prezime korisnika</InputGroup.Text>
                    <Form.Control
                        placeholder="Prezime"
                        aria-label="userSurname"
                        name="userSurname"
                        aria-describedby="basic-addon1"
                        onChange={e => onChange(e)}
                        value={user.userSurname}
                    />
                </InputGroup>
                <Form.Text id="passwordHelpBlock" muted>
                    Neobavezan unos. Mora biti validan OIB.
                </Form.Text>
                <InputGroup className="mb-3">
                    <InputGroup.Text id="basic-addon1">OIB korisnika</InputGroup.Text>
                    <Form.Control
                        placeholder="OIB"
                        aria-label="OIB"
                        name="OIB"
                        aria-describedby="basic-addon1"
                        onChange={e => onChange(e)}
                        value={user.OIB}
                    />
                </InputGroup>
                <div style={{
                    margin: "auto",
                    width: "40%"
                }}>
                    <Button variant="success" onClick={() => setUserData()} className="me-2">Spremi promjene</Button>
                    <Button variant="danger" onClick={() => deleteUser()}>Obriši</Button>
                </div>
            </div>
        </>
    )

}

export default User
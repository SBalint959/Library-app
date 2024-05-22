import React, { Fragment, useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";

function UsersList() {
    const [users, setUsers] = useState([])

    const getUsersData = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/users/deepaccess",
                {
                    method: "GET",
                    mode: "cors",
                    headers: {
                        "Content-type": "application/json"
                    }
                });
            let jsonData = await response.json();
            console.log(jsonData);
            setUsers(jsonData)

        } catch (e) {
            console.log(e)
        }
    }

    const deleteUser = async (userID) => {
        if (window.confirm("Jeste li sigurni da želite izbrisati korisnika: " + userID)) {
            try {
                const response = await fetch("http://localhost:8080/api/users/" + userID,
                    {
                        method: "DELETE",
                        mode: "cors",
                        headers: {
                            "Content-type": "application/json"
                        }
                    });
                let jsonData = await response.json();
                getUsersData()

            } catch (e) {
                console.log(e)
            }
        }
    }

    useEffect(() => {
        getUsersData();
    }, []);

    return (<>
        <br />
        <div style={{
            margin: "auto",
            width: "50%"
        }}>
            <h2>Korisnici</h2>
            <Table striped bordered hover name="users">
                <thead>
                    <tr>
                        <th name="Ime">Ime</th>
                        <th name="Prezime">Prezime</th>
                        <th name="OIB">OIB</th>
                        <th name="Uloga">Uloga</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {Object.values(users).map((user) => {
                        return (<tr>
                            <td>{user.userName}</td>
                            <td>{user.userSurname}</td>
                            <td>{user.OIB}</td>
                            <td>{user.role.roleName}</td>
                            <td><Button variant="warning" className="me-2" href={"/users/" + user.userID}>Uredi</Button>
                                <Button variant="danger" onClick={() => deleteUser(user.userID)}>Obriši</Button></td>
                        </tr>)
                    })}
                </tbody>
            </Table>
            <Button href="/users/new">Dodaj novog</Button>

        </div>
    </>)

}

export default UsersList
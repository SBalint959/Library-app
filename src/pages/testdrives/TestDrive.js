import React, { Fragment, useState, useEffect } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

function TestDrive() {
    let navigate = useNavigate()
    const testDriveId = useParams().testDriveId
    const [testDrive, setTestDrive] = useState({
        testDriveTime: null,
        testDriveConcluded: null,
        stock: {},
        user: {}
    })
    const [alert, setAlert] = useState(false)

    const getTestDriveData = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/testdrives/deepaccess/" + testDriveId,
                {
                    method: "GET",
                    mode: "cors",
                    headers: {
                        "Content-type": "application/json"
                    }
                });
            let jsonData = await response.json();
            console.log(jsonData);
            setTestDrive(jsonData)

        } catch (e) {
            console.log(e)
        }
    }

    const setTestDriveData = async () => {
        let body = {
            testdriveconcluded: testDrive.testDriveConcluded,
            testdrivetime: testDrive.testDriveTime,
            stockid: testDrive.stock.stockID,
            userid: testDrive.user.userID
        }
        console.log(body)

        try {
            const response = await fetch("http://localhost:8080/api/testdrives/" + testDriveId,
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
            getTestDriveData()
            setAlert(true)

        } catch (e) {
            console.log(e)
        }

    }

    const deleteTestDrive = async () => {
        if (window.confirm("Jeste li sigurni da želite izbrisati testnu vožnju?")) {
            try {
                const response = await fetch("http://localhost:8080/api/testdrives/" + testDriveId,
                    {
                        method: "DELETE",
                        mode: "cors",
                        headers: {
                            "Content-type": "application/json"
                        }
                    });
                //let jsonData = await response.json();
                navigate("/stock/" + testDrive.stock.stockID)

            } catch (e) {
                console.log(e)
            }
        }
    }
    useEffect(() => {
        getTestDriveData();
    }, []);
    const onChange = e => {
        setTestDrive({ ...testDrive, [e.target.name]: e.target.value })
    }

    const parseTime = (timeString) => {
        let dateTimeSplitted = timeString.split("T")
        let date = dateTimeSplitted[0]
        let time = dateTimeSplitted[1]
        let dateSplitted = date.split("-")
        let timeSplitted = time.split(":")
        return dateSplitted[2] + "." + dateSplitted[1] + "." + dateSplitted[0] + " " + timeSplitted[0] + ":" + timeSplitted[1]
    }

    const changeStatus = (e) => {
        if (e.target.checked) {
            setTestDrive({ ...testDrive, testDriveConcluded: true })
        } else {
            setTestDrive({ ...testDrive, testDriveConcluded: false })
        }

    }

    return (
        <>
            <br />
            <div style={{
                margin: "auto",
                width: "50%"
            }}>
                <br />
                {testDrive.testDriveTime ? <><h1>Uređivanje testne vožnje korsinika {testDrive.user.userName} {testDrive.user.userSurname}</h1></> : <></>}
                {alert ? <><Alert key="success" variant="success">
                    Uspješno ažurirano!
                </Alert></> : <></>}
                <InputGroup className="mb-3">
                    <InputGroup.Text id="basic-addon1">Zaliha br.</InputGroup.Text>
                    <Form.Control
                        disabled="true"
                        placeholder="Zaliha"
                        aria-describedby="basic-addon1"
                        onChange={e => onChange(e)}
                        value={testDrive.stock.stockID}
                    />
                </InputGroup>
                <InputGroup className="mb-3">
                    <InputGroup.Text id="basic-addon1">Korisnik</InputGroup.Text>
                    <Form.Control
                        disabled="true"
                        placeholder="Korisnik"
                        aria-describedby="basic-addon1"
                        onChange={e => onChange(e)}
                        value={testDrive.user.userName + " " + testDrive.user.userSurname}
                    />
                </InputGroup>

                <InputGroup className="mb-3">
                    <InputGroup.Text id="basic-addon1">Vrijeme testne vožnje</InputGroup.Text>
                    <Form.Control
                        disabled="true"
                        placeholder="Vrijeme vožnje"
                        aria-label="testDriveTime"
                        name="testDriveTime"
                        aria-describedby="basic-addon1"
                        onChange={e => onChange(e)}
                        value={testDrive.testDriveTime ? parseTime(testDrive.testDriveTime) : ""}
                    />
                </InputGroup>
                <Form.Check
                    type="checkbox"
                    name="testDriveConcluded"
                    label="Vožnja obavljena"
                    checked={testDrive.testDriveConcluded}
                    onChange={e => changeStatus(e)}
                />

                <div style={{
                    margin: "auto",
                    width: "50%"
                }}>
                    <Button href={"/stock/" + testDrive.stock.stockID} className="me-2">Povratak</Button>
                    <Button variant="success" onClick={() => setTestDriveData()} className="me-2">Spremi promjene</Button>
                    <Button variant="danger" onClick={() => deleteTestDrive()}>Obriši</Button>
                </div>
            </div>

        </>
    )

}

export default TestDrive
import React, { Fragment, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

function SingleCar() {
    let navigate = useNavigate()
    const carId = useParams().carId;
    const [car, setCar] = useState({
        modelID: null,
        modelName: null,
        modelHorsePower: null,
        modelTopSpeed: null,
        modelAccelInSeconds: null,
        modelTransmissionType: null,
        brandName: null
    })
    const [brands, setBrands] = useState([])
    let [alert, setAlert] = useState(null)
    const [invalidInputs, setInvalidInputs] = useState(null)

    const getCarData = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/models/deepaccess/" + carId,
                {
                    method: "GET",
                    mode: "cors",
                    headers: {
                        "Content-type": "application/json"
                    }
                });
            let jsonData = await response.json();
            console.log(jsonData);
            setCar({ ...jsonData, brandName: jsonData.brand.brandName })

        } catch (e) {
            console.log(e)
        }
    }

    const getBrandData = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/brands",
                {
                    method: "GET",
                    mode: "cors",
                    headers: {
                        "Content-type": "application/json"
                    }
                });
            let jsonData = await response.json();
            setBrands(jsonData)

        } catch (e) {
            console.log(e)
        }
    }

    const setCarData = async () => {
        let brandID
        for (let brand of brands) {
            if (brand.brandname === car.brandName) {
                brandID = brand.brandid
                break
            }
        }
        let body = {
            modelname: car.modelName,
            modelhorsepower: car.modelHorsePower,
            modeltopspeed: car.modelTopSpeed,
            modelaccelinseconds: car.modelAccelInSeconds,
            modeltransmissiontype: car.modelTransmissionType,
            brandid: brandID
        }
        try {
            const response = await fetch("http://localhost:8080/api/models/" + carId,
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

    const deleteCar = async () => {
        if (window.confirm("Jeste li sigurni da želite izbrisati korisnika: " + carId)) {
            try {
                const response = await fetch("http://localhost:8080/api/models/" + carId,
                    {
                        method: "DELETE",
                        mode: "cors",
                        headers: {
                            "Content-type": "application/json"
                        }
                    });
                //let jsonData = await response.json();
                navigate("/cars")
            } catch (e) {
                console.log(e)
            }
        }
    }
    const onChange = e => {
        setCar({ ...car, [e.target.name]: e.target.value })
    }

    useEffect(() => {
        getCarData();
        getBrandData()
    }, []);

    return (<>
        <br />
        <div style={{
            margin: "auto",
            width: "50%"
        }}>
            <h1>Uređivanje modela {car.modelName}</h1>
            {alert === "OK" ? <><Alert key="success" variant="success">
                Uspješno ažurirano!
            </Alert></> : <></>}
            {alert === "ERROR" ? <><Alert key="danger" variant="danger">
                Neispravno uneseni podaci! {invalidInputs.join(", ")}
            </Alert></> : <></>}
            <br />
            <Form.Text id="passwordHelpBlock" muted>
                Obavezan odabrati.
            </Form.Text>
            <Form.Select aria-label="maker" name="brandName" value={car.brandName} onChange={e => onChange(e)}>
                <option>Odaberite proizvođača</option>
                {Object.values(brands).map((brand) => {
                    return (<option>{brand.brandname}</option>)
                })}
            </Form.Select>
            <br />
            <Form.Text id="passwordHelpBlock" muted>
                Obavezan unos.
            </Form.Text>
            <InputGroup className="mb-3">
                <InputGroup.Text id="basic-addon1">Model</InputGroup.Text>
                <Form.Control
                    placeholder="Model"
                    aria-label="modelName"
                    name="modelName"
                    aria-describedby="basic-addon1"
                    onChange={e => onChange(e)}
                    value={car.modelName}
                />
            </InputGroup>
            <Form.Text id="passwordHelpBlock" muted>
                Obavezan unos. Mora biti broj veći od 0.
            </Form.Text>
            <InputGroup className="mb-3">
                <InputGroup.Text id="basic-addon1">Snaga u KS</InputGroup.Text>
                <Form.Control
                    placeholder="Snaga"
                    aria-label="modelHorsepower"
                    name="modelHorsepower"
                    aria-describedby="basic-addon1"
                    onChange={e => onChange(e)}
                    value={car.modelHorsePower}
                />
            </InputGroup>
            <Form.Text id="passwordHelpBlock" muted>
                Obavezan unos. Mora biti broj veći od 0.
            </Form.Text>
            <InputGroup className="mb-3">
                <InputGroup.Text id="basic-addon1">Maksimalna brzina</InputGroup.Text>
                <Form.Control
                    placeholder="Maksimalna brzina"
                    aria-label="modelTopSpeed"
                    name="modelTopSpeed"
                    aria-describedby="basic-addon1"
                    onChange={e => onChange(e)}
                    value={car.modelTopSpeed
                    }
                />
            </InputGroup>
            <Form.Text id="passwordHelpBlock" muted>
                Obavezan unos. Mora biti broj veći od 0.
            </Form.Text>
            <InputGroup className="mb-3">
                <InputGroup.Text id="basic-addon1">Ubrzanje do 100 KM/H</InputGroup.Text>
                <Form.Control
                    placeholder="Ubrzanje"
                    aria-label="modelAccelInSeconds"
                    name="modelAccelInSeconds"
                    aria-describedby="basic-addon1"
                    onChange={e => onChange(e)}
                    value={car.modelAccelInSeconds}
                />
            </InputGroup>
            <Form.Text id="passwordHelpBlock" muted>
                Obavezan unos. Mora biti "automatic" ili "manual"
            </Form.Text>
            <InputGroup className="mb-3">
                <InputGroup.Text id="basic-addon1">Vrsta mijenjača</InputGroup.Text>
                <Form.Control
                    placeholder="Mijenjač"
                    aria-label="modelTransmissionType"
                    name="modelTransmissionType"
                    aria-describedby="basic-addon1"
                    onChange={e => onChange(e)}
                    value={car.modelTransmissionType}
                />
            </InputGroup>
            <div style={{
                margin: "auto",
                width: "40%"
            }}>
                <Button variant="success" onClick={() => setCarData()} className="me-2">Spremi promjene</Button>
                <Button variant="danger" onClick={() => deleteCar()}>Obriši</Button>
            </div>
            <br />
        </div>
    </>)

}

export default SingleCar
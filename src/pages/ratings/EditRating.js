import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

function EditRating() {
    const { ratingId } = useParams();
    const navigate = useNavigate();
    const [rating, setRating] = useState({
        score: '',
        review: ''
    });
    const [alert, setAlert] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRatingData = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/ratings/${ratingId}`, {
                    method: 'GET',
                    mode: 'cors',
                    headers: {
                        'Accept': 'application/vnd.api+json',
                        'Content-Type': 'application/vnd.api+json'
                    }
                });
                const jsonData = await response.json();
                setRating(jsonData.data.attributes);
                setLoading(false);
            } catch (e) {
                console.log(e);
                setLoading(false);
            }
        };

        fetchRatingData();
    }, [ratingId]);

    const updateRating = async () => {
        const body = {
            type: "ratings",
            id: ratingId,
            attributes: {
                score: rating.score,
                review: rating.review,
            }
        };

        try {
            const response = await fetch(`http://localhost:3000/api/ratings/${ratingId}`, {
                method: 'PATCH',
                mode: 'cors',
                headers: {
                    'Accept': 'application/vnd.api+json',
                    'Content-Type': 'application/vnd.api+json'
                },
                body: JSON.stringify({ data: body })
            });
            const jsonData = await response.json();

            if (response.status === 200) {
                setAlert("OK");
                setTimeout(() => navigate(`/catalog`), 2000); // Redirect to the book ratings page after 2 seconds
            } else {
                setAlert("ERROR");
            }

        } catch (e) {
            console.log(e);
            setAlert("ERROR");
        }
    };

    const onChange = e => {
        setRating({ ...rating, [e.target.name]: e.target.value });
    };

    const onSelectRatingGrade = grade => {
        setRating({ ...rating, score: grade });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!rating) {
        return <div>Error loading rating data.</div>;
    }

    return (
        <>
            <br />
            <div style={{ margin: "auto", width: "50%" }}>
                <h2>Update Rating</h2>
                {alert === "OK" && (
                    <Alert key="success" variant="success" role="good-alert">
                        Recenzija uspješno ažurirana!
                    </Alert>
                )}
                {alert === "ERROR" && (
                    <Alert key="danger" variant="danger" role="bad-alert">
                        Neispravno uneseni podaci!
                    </Alert>
                )}
                <br />
                <InputGroup className="mb-3">
                    <InputGroup.Text id="basic-addon1">Recenzija</InputGroup.Text>
                    <Form.Control
                        as="textarea"
                        placeholder="Napišite svoju recenziju ovdje.."
                        aria-label="review"
                        name="review"
                        aria-describedby="basic-addon1"
                        onChange={onChange}
                        value={rating.review}
                    />
                </InputGroup>
                <br />
                <Form.Select
                    aria-label="score"
                    name="score"
                    onChange={e => onSelectRatingGrade(e.target.value)}
                    value={rating.score}
                >
                    <option>Odaberite ocjenu</option>
                    {[1, 2, 3, 4, 5].map(grade => (
                        <option key={grade} value={grade}>{grade}</option>
                    ))}
                </Form.Select>
                <br />
                <Button variant="primary" onClick={updateRating}>Ažuriraj recenziju</Button>
            </div>
        </>
    );
}

export default EditRating;

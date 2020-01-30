import React, { useState, useContext } from 'react';
import AuthApi from "../services/authAPI";
import AuthContext from "../contexts/AuthContext";
import Field from "../components/forms/Field";
import { toast } from "react-toastify";

const LoginPage = ({ history }) => {
    const { setIsAuthenticated } = useContext(AuthContext);
    const [credentials, setCredentials] = useState({
        username: "",
        password: ""
    });
    const [error, setError] = useState("");

    // Gestion des champs.
    const handleChange = ({currentTarget}) => {
        const {value, name} = currentTarget;
        setCredentials({...credentials, [name]: value});
    };

    // Gestion du submit
    const handleSubmit = async event => {
        event.preventDefault();

        try {
            await AuthApi.authenticate(credentials);
            setError("");
            setIsAuthenticated(true);
            toast.success("Vous êtes désormais connecté !")
            history.replace("/customers");
        } catch (error) {
            setError("Aucun compte ne possède cette adresse ou, les informations ne correspondent pas.");
            toast.error("Une erreur est survenue !");
        }
    };

    return (
        <>
            <h1>Connexion à l'application</h1>

            <form onSubmit={handleSubmit}>
                <Field
                    label={"Adresse email"}
                    name={"username"}
                    type={"email"}
                    value={credentials.username}
                    onChange={handleChange}
                    placeholder={"Adresse email de connexion"}
                    error={error}
                />
                <Field
                    label={"Mot de passe"}
                    name={"password"}
                    type={"password"}
                    onChange={handleChange}
                    value={credentials.password}
                />
                <div className="form-group">
                    <button type="submit" className="btn btn-success">
                        Je me connecte
                    </button>
                </div>
            </form>
        </>
    );
};

export default LoginPage;

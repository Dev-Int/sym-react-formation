import React, { useState, useEffect } from 'react';
import {Link} from "react-router-dom";
import {toast} from "react-toastify";
import UsersAPI from "../services/UsersAPI";
import FormContentLoader from "../components/loaders/FormContentLoader";
import Field from "../components/forms/Field";
import Select from "../components/forms/Select";

const UserPage = ({ match, history }) => {
    const { id } = match.params;
    const [user, setUser] =useState({
        firstName: "",
        lastName: "",
        email: "",
        roles: ""
    });
    const [errors, setErrors] =useState({
        firstName: "",
        lastName: "",
        email: "",
        roles: ""
    });
    const [loading, setLoading] = useState(true);

    // Récupérer l'utilisateur en fonction de l'identifiant.
    const fetchUser = async id => {
        try {
            const {firstName, lastName, email, roles} = await UsersAPI.find(id);
            setUser({firstName, lastName, email, roles: roles[0]});
            setLoading(false);
        } catch (error) {
            toast.error("Impossible de charger l'utilisateur !");
            history.replace("/users");
        }
    };

    // Chargement de l'utilisateur si besoin au chargement du composant, ou au changement de l'identifiant.
    useEffect(() => {
        fetchUser(id);
    }, [id]);

    // Gestion des changements des champs du formulaire.
    const handleChange = ({ currentTarget }) => {
        const { name, value } = currentTarget;
        setUser({ ...user, [name]: value });
    };

    // Gestion de la soumission du formulaire.
    const handleSubmit = async event => {
        event.preventDefault();

        try {
            await UsersAPI.update(id, user);
            setErrors({});
            toast.success(`Les informations de ${user.firstName} ${user.lastName} sont bien mises à jour`);
        } catch ({response}) {
            const {violations} = response.data;
            if (violations) {
                const apiErrors = {};
                violations.forEach(({propertyPath, message}) => {
                    apiErrors[propertyPath] = message;
                });
                setErrors(apiErrors);
                toast.error("Des erreurs dans votre formulaire !");
            }
        }
    };

    return(
        <>
            <h1>Modification de {user.firstName} {user.lastName}</h1>

            {loading && <FormContentLoader />}
            {!loading && (<form onSubmit={handleSubmit}>
                <Field
                    name="firstName"
                    label="Prénom"
                    placeholder="Votre joli prénom"
                    error={errors.firstName}
                    value={user.firstName}
                    onChange={handleChange}
                />
                <Field
                    name="lastName"
                    label="Nom de famille"
                    placeholder="Votre nom de famille"
                    error={errors.lastName}
                    value={user.lastName}
                    onChange={handleChange}
                />
                <Field
                    name="email"
                    label="Email"
                    placeholder="Votre adresse email"
                    error={errors.email}
                    value={user.email}
                    onChange={handleChange}
                />
                <Select
                    name="roles"
                    label="Autorisation"
                    value={user.roles}
                    error={errors.roles}
                    onChange={handleChange}
                >
                    <option value="ROLE_USER">Utilisateur</option>
                    <option value="ROLE_ADMIN">Administrateur</option>
                </Select>

                <div className="form-group">
                    <Link to="/users" className="btn btn-link">
                        &laquo; Retour à la liste
                    </Link>
                    <button type="submit" className="btn btn-success">
                        Modifier
                    </button>
                </div>
            </form>)}
        </>
    );
};

export default UserPage;
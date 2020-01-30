import React, { useState, useEffect } from 'react';
import {Link} from "react-router-dom";
import Field from "../components/forms/Field";
import CustomersAPI from "../services/customersAPI";

const CustomerPage = ({match, history}) => {
    const { id = "new" } = match.params;

    const [customer, setCustomer] = useState({
        lastName: "",
        firstName: "",
        email: "",
        company: ""
    });

    const [errors, setErrors] = useState({
        lastName: "",
        firstName: "",
        email: "",
        company: ""
    });

    const [editing, setEditing] = useState(false);

    // Récupérer le customer en fonction de l'identifiant.
    const fetchCustomer = async id => {
        try {
            const {firstName, lastName, email, company} = await CustomersAPI.find(id);

            setCustomer({ firstName, lastName, email, company });
        } catch (error) {
            // TODO : Notification flash d'une erreur.
            history.replace("/customers");
        }
    };

    // Chargement du customer si besoin au chargement du composant ou au changement de l'identifiant.
    useEffect( () => {
        if (id !== "new") {
            setEditing(true);
            fetchCustomer(id);
        }
    }, [id]);

    // Gestion de la soumission du formulaire.
    const handleSubmit = async event => {
        event.preventDefault();

        try {
            if (editing) {
                await CustomersAPI.update(id, customer);
                setErrors({});
                // TODO : Notification flash de succès
            } else {
                await CustomersAPI.create(customer);
                setErrors({});
                // TODO : Notification flash de succès
                history.replace("/customers");
            }
        } catch({response}) {
           const {violations} = response.data;
           if (violations) {
               const apiErrors = {};
               violations.forEach(({propertyPath, message}) => {
                   apiErrors[propertyPath] = message;
               });

               setErrors(apiErrors);
               // TODO : Flash notification d'erreurs
           }
        }
    };

    return (
        <>
            <h1>{!editing && ("Création") || ("Modification")} d'un client</h1>

            <form onSubmit={handleSubmit}>
                <Field
                    name="lastName"
                    label="Nom de famille"
                    placeholder="Nom de famille du client"
                    value={customer.lastName}
                    onChange={handleChange}
                    error={errors.lastName}
                />
                <Field
                    name="firstName"
                    label="Prénom"
                    placeholder="Prénom du client"
                    value={customer.firstName}
                    onChange={handleChange}
                    error={errors.firstName}
                />
                <Field
                    name="email"
                    label="Email"
                    placeholder="Adresse courrier électronique du client"
                    value={customer.email}
                    onChange={handleChange}
                    type="email"
                    error={errors.email}
                />
                <Field
                    name="company"
                    label="Entreprise"
                    placeholder="Entreprise du client du client"
                    value={customer.company}
                    onChange={handleChange}
                    error={errors.company}
                />

                <div className="form-group">
                    <Link to="/customers" className="btn btn-link">&laquo; Retour à la liste</Link>
                    <button type="submit" className="btn btn-success">Enregistrer</button>
                </div>
            </form>
        </>
    );
};

export default CustomerPage;

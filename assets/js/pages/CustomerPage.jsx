import React, { useState, useEffect } from 'react';
import {Link} from "react-router-dom";
import Field from "../components/forms/Field";
import CustomersAPI from "../services/customersAPI";
import { toast } from "react-toastify";
import FormContentLoader from "../components/loaders/FormContentLoader";

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
    const [loading, setLoading] = useState(false);

    // Récupérer le customer en fonction de l'identifiant.
    const fetchCustomer = async id => {
        try {
            const {firstName, lastName, email, company} = await CustomersAPI.find(id);
            setCustomer({ firstName, lastName, email, company });
            setLoading(false);
        } catch (error) {
            toast.error("Impossible de charger le client !");
            history.replace("/customers");
        }
    };

    // Chargement du customer si besoin au chargement du composant ou au changement de l'identifiant.
    useEffect( () => {
        if (id !== "new") {
            setLoading(true);
            setEditing(true);
            fetchCustomer(id);
        }
    }, [id]);

    // Gestion des changements des champs du formulaire.
    const handleChange = ({ currentTarget }) => {
        const { name, value } = currentTarget;
        setCustomer({ ...customer, [name]: value });
    };

    // Gestion de la soumission du formulaire.
    const handleSubmit = async event => {
        event.preventDefault();

        try {
            setErrors({});
            if (editing) {
                await CustomersAPI.update(id, customer);
                toast.success(`${customer.firstName} ${customer.lastName} est bien mise à jour`);
            } else {
                await CustomersAPI.create(customer);
                toast.success(`${customer.firstName} ${customer.lastName} est bien créer`);
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
               toast.error("Des erreurs dans votre formulaire !");
           }
        }
    };

    return (
        <>
            <h1>{!editing && ("Création") || ("Modification")} d'un client</h1>

            {loading && <FormContentLoader />}

            {!loading && (<form onSubmit={handleSubmit}>
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
            </form>)}
        </>
    );
};

export default CustomerPage;

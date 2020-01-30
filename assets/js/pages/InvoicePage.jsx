import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import CustomersAPI from "../services/customersAPI";
import InvoicesAPI from "../services/invoicesAPI";
import Field from "../components/forms/Field";
import Select from "../components/forms/Select";

const InvoicePage = ({match, history}) => {
    const { id = "new" } = match.params;

    const [invoice, setInvoice] = useState({
        amount: "",
        customer: "",
        status: "SENT"
    });

    const [customers, setCustomers] = useState([]);

    const [errors, setErrors] = useState({
        amount: "",
        customer: "",
        status: ""
    });

    const [editing, setEditing] = useState(false);

    // Récupérer la facture en fonction de l'identifiant.
    const fetchInvoice = async id => {
        try {
            const {amount, customer, status} = await InvoicesAPI.find(id);

            setInvoice({ amount, status, customer: customer.id });
        } catch (error) {
            // TODO : Notification flash d'une erreur.
            history.replace("/invoices");
        }
    };

    // Chargement de la facture si besoin au chargement du composant ou au changement de l'identifiant.
    useEffect( () => {
        if (id !== "new") {
            setEditing(true);
            fetchInvoice(id);
        }
    }, [id]);

    // Récupérer les customers.
    const fetchCustomers = async () => {
        try {
            const data = await CustomersAPI.findAll();
            setCustomers(data);

            if (!invoice.customer) setInvoice({...invoice, customer: data[0].id});
        } catch (error) {
            console.log(error.response);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    // Gestion des changements des champs du formulaire.
    const handleChange = ({ currentTarget }) => {
        const { name, value } = currentTarget;
        setInvoice({ ...invoice, [name]: value });
    };

    // Gestion de la soumission du formulaire.
    const handleSubmit = async event => {
        event.preventDefault();

        try {
            if (editing) {
                await InvoicesAPI.update(id, invoice);
                setErrors({});
                // TODO : Notification flash de succès
            } else {
                await InvoicesAPI.create(invoice);
                setErrors({});
                // TODO : Notification flash de succès
                history.replace("/invoices");
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
            <h1>{!editing && ("Création") || ("Modification")} d'une facture</h1>

            <form onSubmit={handleSubmit}>
                <Field
                    name="amount"
                    // type="number"
                    placeholder="Montant de la facture"
                    label="Montant"
                    onChange={handleChange}
                    value={invoice.amount}
                    error={errors.amount}
                />

                <Select
                    name="customer"
                    label="Client"
                    value={invoice.customer.id}
                    error={errors.customer}
                    onChange={handleChange}
                >
                    {customers.map(customer => (
                        <option key={customer.id} value={customer.id}>
                            {customer.firstName} {customer.lastName}
                        </option>
                    ))}
                </Select>

                <Select
                    name="status"
                    label="Statut"
                    value={invoice.status}
                    error={errors.status}
                    onChange={handleChange}
                >
                    <option value="SENT">Envoyée</option>
                    <option value="PAID">Payée</option>
                    <option value="CANCELLED">Annulée</option>
                </Select>

                <div className="form-group">
                    <Link to="/invoices" className="btn btn-link">
                        &laquo; Retour à la liste
                    </Link>
                    <button type="submit" className="btn btn-success">
                        {!editing && ("Enregistrer") || ("Modifier")}
                    </button>
                </div>
            </form>
        </>
    );
};

export default InvoicePage;

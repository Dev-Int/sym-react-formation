import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import CustomersAPI from "../services/customersAPI";
import InvoicesAPI from "../services/invoicesAPI";
import NumberField from "../components/forms/NumberField";
import Select from "../components/forms/Select";
import { toast } from "react-toastify";
import FormContentLoader from "../components/loaders/FormContentLoader";

const InvoicePage = ({match, history}) => {
    const { id = "new" } = match.params;
    const [chrono, setChrono] = useState();
    const [invoice, setInvoice] = useState({
        amount: "",
        customer: "",
        status: "SENT"
    });
    const [errors, setErrors] = useState({
        amount: "",
        customer: "",
        status: ""
    });
    const [customers, setCustomers] = useState([]);
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(true);

    // Récupérer la facture en fonction de l'identifiant.
    const fetchInvoice = async id => {
        try {
            const {chrono, amount, status, customer} = await InvoicesAPI.find(id);
            setInvoice({ amount, status, customer: customer.id });
            setChrono(chrono);
            setLoading(false);
        } catch (error) {
            toast.error("Impossible de charger les factures !");
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
            setLoading(false);
        } catch (error) {
            toast.error("Impossible de charger les clients !");
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
                toast.success(`La facture ${chrono} est bien mise à jour`);
            } else {
                console.log(invoice);
                await InvoicesAPI.create(invoice);
                setErrors({});
                toast.success(`la facture est bien créée`);
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
                toast.error("Des erreurs dans votre formulaire !");
            }
        }
    };

    return (
        <>
            <h1>{!editing && ("Création d'une") || ("Modification de la")} facture {editing && (" n°" + chrono)}</h1>
            {loading && <FormContentLoader />}
            {!loading && (<form onSubmit={handleSubmit}>
                <NumberField
                    name="amount"
                    placeholder="Montant de la facture"
                    label="Montant"
                    onChange={handleChange}
                    value={invoice.amount}
                    error={errors.amount}
                />

                <Select
                    name="customer"
                    label="Client"
                    value={invoice.customer}
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
            </form>)}
        </>
    );
};

export default InvoicePage;

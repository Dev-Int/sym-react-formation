import React, { useEffect, useState } from "react";
import moment from "moment";
import Pagination from "../components/Pagination";
import InvoicesAPI from "../services/invoicesAPI";

const STATUS_CLASSES = {
    PAID: "success",
    SENT: "primary",
    CANCELLED: "danger"
};
const STATUS_LABELS = {
    PAID: "Payé",
    SENT: "Envoyé",
    CANCELLED: "Annulé"
};

const InvoicesPage = (props) => {

    const [invoices, setInvoices] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState('');

    const itemsPerPage = 20;

    // Récupérer les invoices.
    const fetchInvoices = async () => {
        try {
            const data = await InvoicesAPI.findAll();
            setInvoices(data);
        } catch (error) {
            console.log(error.response);
        }
    };

    // Au chargement du composant, on va chercher les invoices.
    useEffect(() => {
        fetchInvoices();
    }, []);

    // Gestion de la suppression d'un customer.
    const handleDelete = async id => {
        const originalInvoices = [...invoices];
        setInvoices(invoices.filter(invoice => invoice.id !== id));

        try {
            await InvoicesAPI.remove(id);
        } catch (error) {
            setInvoices(originalInvoices);
        }
    };

    // Gestion du changement de page.
    const handlePageChange = page => setCurrentPage(page);

    // Gestion de la recherche.
    const handleSearch = ({currentTarget}) => {
        setSearch(currentTarget.value);
        setCurrentPage(1);
    };

    // Gestion du format de date.
    const formatDate = (str) => moment(str).format('DD/MM/YYYY');

    // Filtrage des invoices en fonction de la recherche.
    const filteredInvoices = invoices.filter(
        i =>
            i.customer["firstName"].toLowerCase().includes(search.toLowerCase()) ||
            i.customer["lastName"].toLowerCase().includes(search.toLowerCase()) ||
            i.amount.toString().startsWith(search.toLowerCase()) ||
            STATUS_LABELS[i.status].toLowerCase().includes(search.toLowerCase())
    );

    // Pagination des données.
    const paginatedInvoices = Pagination.getData(
        filteredInvoices,
        currentPage,
        itemsPerPage
    );

    return (
        <>
            <h1>Liste des Factures</h1>

            <div className="form-group">
                <input type="text" onChange={handleSearch} value={search} className="form-control" placeholder="Rechercher..."/>
            </div>

            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>Numéro</th>
                        <th>Client</th>
                        <th className={"text-center"}>Date</th>
                        <th className={"text-center"}>Statut</th>
                        <th className={"text-center"}>Montant</th>
                        <th className={"text-center"}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                {paginatedInvoices.map(invoice => <tr key={invoice.id}>
                    <td>{invoice.chrono}</td>
                    <td>
                        <a href="#">
                            {invoice.customer['firstName']} {invoice.customer['lastName']}
                        </a>
                    </td>
                    <td className={"text-center"}>{formatDate(invoice.sentAt)}</td>
                    <td className={"text-center"}>
                        <span className={"badge badge-" + STATUS_CLASSES[invoice.status]}>{STATUS_LABELS[invoice.status]}</span>
                    </td>
                    <td className={"text-right"}>{invoice.amount.toLocaleString()} €</td>
                    <td>
                        <button
                            className="btn btn-sm btn-primary mr-1"
                        >
                            Modifier
                        </button>
                        <button
                            onClick={() => handleDelete(invoice.id)}
                            className="btn btn-sm btn-danger"
                        >
                            Supprimer
                        </button>
                    </td>
                </tr>)}

                </tbody>
            </table>

            {itemsPerPage < filteredInvoices.length && (
                <Pagination
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    length={filteredInvoices.length}
                    onPageChanged={handlePageChange}
                />
            )}
        </>
    );
};

export default InvoicesPage;

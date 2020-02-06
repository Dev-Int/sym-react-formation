import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import {toast} from "react-toastify";
import jwtDecode from "jwt-decode";
import UsersAPI from "../services/UsersAPI";
import TableLoader from "../components/loaders/TableLoader";

const customStyles = {
    content : {
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)'
    }
};

const UsersPage = (props) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalIsOpen, setIsOpen] = useState(false);
    const [currentUser] = useState(() =>{
        const token = window.localStorage.getItem("authToken");
        const  { username } = jwtDecode(token);
        return username;
    });

    // Ouvrir une fenêtre modale.
    const openModal = () => {
        setIsOpen(true);
    };

    // Fermer une fenêtre modale.
    const closeModal = () => {
        setIsOpen(false);
    };

    // Récupérer les utilisateurs.
    const fetchUsers = async () => {
        try {
            const data = await UsersAPI.findAll();
            setUsers(data);
            setLoading(false);
        } catch (error) {
            toast.error("Impossible de charger les utilisateurs !");
        }
    };

    // Au chargement du composant, on va chercher les utilisateurs.
    useEffect( () => {
        fetchUsers();
    }, []);

    // Gestion de la suppression d'un utilisateur.
    const handelDelete = async id => {
        closeModal();

        const originalUsers = [...users];
        setUsers(users.filter(user => user.id !== id));

        try {
            await UsersAPI.remove(id);
            toast.success("L'utilisateur est bien supprimé");
        } catch (error) {
            setUsers(originalUsers);
            toast.error("La suppression a échoué !");
        }
    };

    const handelRevoke = async id => {
        const originalUsers = [...users];
        setUsers(users.filter(user => user.id === +id));
        users.roles = "ROLE_USER";

        try {
            await UsersAPI.update(id, users);
            toast.success("L'utilisateur est révoqué !");
            await fetchUsers();
        } catch (error) {
            setUsers(originalUsers);
            toast.error("La révocation a échoué !");
        }
    };

    const handlePromote = async id => {
        const originalUsers = [...users];
        setUsers(users.filter(user => user.id === +id));
        users.roles = "ROLE_ADMIN";

        try {
            await UsersAPI.update(id, users);
            toast.success("L'utilisateur est promu.");
            await fetchUsers();
        } catch (error) {
            setUsers(originalUsers);
            toast.error("La promotion a échoué !");
        }
    };

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1>Liste des Utilisateurs</h1>
            </div>

            <table className="table table-hover">
                <thead>
                <tr>
                    <th>Id.</th>
                    <th>Prénom</th>
                    <th>Nom</th>
                    <th>Email</th>
                    <th className={"text-center"}>Actions</th>
                </tr>
                </thead>
                {!loading && (<tbody>
                    {users.map(user => <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.firstName}</td>
                        <td>{user.lastName}</td>
                        <td>{user.email}</td>
                        <td className={"text-center"}>
                            {user.roles[0] === "ROLE_ADMIN" && (
                                <button
                                    onClick={() => handelRevoke(user.id)}
                                    className={"btn btn-sm mr-1" + (user.email === currentUser && (" btn-success") || (" btn-warning"))}
                                    disabled={user.email === currentUser}
                                    title="Cet utilisateur ne sera plus administrateur"
                                >
                                    {user.email === currentUser && ("C'est vous") || ("Révoquer")}
                                </button>
                            ) || (
                                <button
                                    onClick={() => handlePromote(user.id)}
                                    className="btn btn-sm btn-success mr-1"
                                    title="Cet utilisateur sera administrateur"
                                >
                                    Promouvoir
                                </button>
                            )}
                            {user.email !== currentUser && (
                                <button
                                    onClick={() => openModal()}
                                    disabled={user.customers.length > 0}
                                    className="btn btn-sm btn-danger"
                                    title={user.customers.length > 0 && (
                                        "Cet utilisateur possède des clients"
                                    ) || (
                                        "Supprimer l'utilisateur"
                                    )}
                                >
                                    Supprimer
                                </button>
                            )}
                            <Modal
                                isOpen={modalIsOpen}
                                onRequestClose={closeModal}
                                style={customStyles}
                                contentLabel="Attention !!"
                            >
                                <h2>Attention !!</h2>
                                <p>Vous êtes sur le point de supprimer l'utilisateur {user.firstName} {user.lastName}.</p>
                                <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => handelDelete(user.id)}
                                >
                                    Supprimer
                                </button>
                                <button
                                    className="btn btn-sm btn-primary"
                                    onClick={() => closeModal()}
                                >
                                    Annuler
                                </button>
                            </Modal>
                        </td>
                    </tr>)}
                </tbody>)}
            </table>

            {loading && <TableLoader/>}
        </>
    );
};

export default UsersPage;

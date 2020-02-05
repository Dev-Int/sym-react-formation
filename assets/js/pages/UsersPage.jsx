import React, { useState, useEffect } from 'react';
import {toast} from "react-toastify";
import UsersAPI from "../services/UsersAPI";
import TableLoader from "../components/loaders/TableLoader";
import AdminContext from "../contexts/AdminContext";

const UsersPage = (props) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

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
        // TODO : Ajouter une confirmation de suppression.
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
                    <th className={"text-center"}>Acions</th>
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
                                    className="btn btn-sm btn-warning mr-1"
                                >
                                    Révoquer
                                </button>
                            ) || (
                                <button
                                    onClick={() => handlePromote(user.id)}
                                    className="btn btn-sm btn-success mr-1"
                                >
                                    Promouvoir
                                </button>
                            )}
                            <button
                                onClick={() => handelDelete(user.id)}
                                className="btn btn-sm btn-danger"
                            >
                                Supprimer
                            </button>
                        </td>
                    </tr>)}
                </tbody>)}
            </table>

            {loading && <TableLoader/>}
        </>
    );
};

export default UsersPage;

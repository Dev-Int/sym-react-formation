import React, { useState, useEffect } from 'react';
import {toast} from "react-toastify";
import UsersAPI from "../services/UsersAPI";
import {Link} from "react-router-dom";
import TableLoader from "../components/loaders/TableLoader";

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
        const originalUsers = [...users];
        setUsers(users.filter(user => user.id !== id));

        try {
            await UsersAPI.remove(id);
            toast.success("L'utilisateur est bien supprimé");
        } catch (error) {
            setUsers(originalUsers);
            toast.error("La suppression a échouée !");
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
                            <Link
                                to={"/users/" + user.id}
                                className="btn btn-sm btn-primary mr-1"
                            >
                                Modifier
                            </Link>
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
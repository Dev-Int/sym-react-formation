import React, { useContext } from 'react';
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import AuthAPI from "../services/authAPI";
import AdminContext from "../contexts/AdminContext";
import AuthContext from "../contexts/AuthContext";

const Navbar = ({ history }) => {
    const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
    const { isAdmin, setIsAdmin } = useContext(AdminContext);
    const handleLogout =() => {
        AuthAPI.logout();
        setIsAdmin(false);
        setIsAuthenticated(false);
        toast.info("Vous êtes désormais déconnecté ");
        history.push("/login");
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <NavLink className="navbar-brand" to="/">
                SymReact !
            </NavLink>
            <button
                className="navbar-toggler"
                type="button"
                data-toggle="collapse"
                data-target="#navbarColor03"
                aria-controls="navbarColor03"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span className="navbar-toggler-icon"/>
            </button>

            <div className="collapse navbar-collapse" id="navbarColor03">
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/customers">
                            Clients
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/invoices">
                            Factures
                        </NavLink>
                    </li>
                    {isAdmin && (<li className="nav-item">
                        <NavLink className="nav-link" to="/users">
                            Utilisateurs
                        </NavLink>
                    </li>)}
                </ul>
                <ul className="navbar-nav ml-auto">
                    {!isAuthenticated && (
                        <>
                            <li className="nav-item">
                                <NavLink to="/register" className="nav-link">
                                    Inscription
                                </NavLink>
                            </li>
                            <li className="nav-item mr-1">
                                <NavLink to="/login" className="btn btn-success">
                                    Connexion !
                                </NavLink>
                            </li>
                        </>
                    ) || (
                        <>
                            <li className="nav-item">
                                <button onClick={handleLogout} className="btn btn-danger">
                                    Déconnexion
                                </button>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;

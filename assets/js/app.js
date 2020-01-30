/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */
// Les imports importants
import React, {useContext, useState} from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Switch, Route, withRouter, Redirect } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

// Les imports de nos components
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import AuthContext from "./contexts/AuthContext";
import HomePage from "./pages/HomePage";
import CustomersPage from "./pages/CustomersPage";
import CustomerPage from "./pages/CustomerPage";
import InvoicesPage from "./pages/InvoicesPage";
import InvoicePage from "./pages/InvoicePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AuthAPI from "./services/authAPI";
// import CustomersPageWithPagination from "./pages/CustomersPageWithPagination";

// any CSS you import will output into a single css file (app.css in this case)
import '../css/app.css';
import 'react-toastify/dist/ReactToastify.css';

// Need jQuery? Install it with "yarn add jquery", then uncomment to import it.
// import $ from 'jquery';

console.log('Bonjour Webpack Encore! Éditez moi in assets/js/app.js');

AuthAPI.setUp();

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(
        AuthAPI.isAuthenticated()
    );

    const NavbarWithRouter = withRouter(Navbar);

    return (
        <AuthContext.Provider value={
            {isAuthenticated, setIsAuthenticated}
        }>
            <HashRouter>
                <NavbarWithRouter />

                <main className="container pt-5">
                    <Switch>
                        <Route path={"/login"} component={LoginPage} />
                        <Route path={"/register"} component={RegisterPage} />
                        <PrivateRoute path={"/invoices/:id"} component={InvoicePage} />
                        <PrivateRoute path={"/invoices"} component={InvoicesPage} />
                        <PrivateRoute path={"/customers/:id"} component={CustomerPage} />
                        <PrivateRoute path={"/customers"} component={CustomersPage} />
                        <Route path={"/"} component={HomePage} />
                    </Switch>
                </main>
            </HashRouter>
            <ToastContainer position={toast.POSITION.BOTTOM_RIGHT} />
        </AuthContext.Provider>
    );
};

const rootElement = document.querySelector('#app');
ReactDOM.render(<App />, rootElement);

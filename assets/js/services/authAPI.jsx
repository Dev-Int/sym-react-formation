import axios from "axios";
import jwtDecode from "jwt-decode";
import {LOGIN_API} from "./config";

/**
 * Déconnexion (suppression du jeton du localStorage et sur Axios).
 */
function logout() {
    window.localStorage.removeItem("authToken");
    delete axios.defaults.headers["Authorization"];
}

/**
 * Requête HTTP d'authentification et stockage du jeton dans le localStorage et sur Axios.
 * @param {object} credentials
 * @return Promise<AxiosResponse<any>>
 */
function authenticate(credentials) {
    return axios
        .post(LOGIN_API, credentials)
        .then(response => response.data.token)
        .then(token => {
            // Je stoke le jeton dans le localStorage.
            window.localStorage.setItem("authToken", token);

            // On prévient Axios qu'on a maintenant un header par défaut sur toutes nos futures requêtes http.
            setAxiosToken(token);
        })
    ;
}

/**
 * Positionne le jeton jwt sur Axios.
 * @param {string} token
 */
function setAxiosToken(token) {
    axios.defaults.headers["Authorization"] = "Bearer " + token;
}

/**
 * Mise en place lors du chargement de l'application.
 */
function setUp() {
    // 1. Existe-t-il un jeton ?
    const token = window.localStorage.getItem("authToken");

    // 2. Le jeton est-il toujours valide ?
    if (token) {
        const {exp: expiration} = jwtDecode(token);
        if (expiration * 1000 > new Date().getTime()) {
            setAxiosToken(token);
        }
    }
}

/**
 * Savoir si l'on est authentifié.
 * @return {boolean}
 */
function isAuthenticated() {
    // 1. Existe-t-il un jeton ?
    const token = window.localStorage.getItem("authToken");

    // 2. Le jeton est-il toujours valide ?
    if (token) {
        const {exp: expiration} = jwtDecode(token);
        return expiration * 1000 > new Date().getTime();
    }

    return false;
}

/**
 * Savoir si l'on est admin.
 * @return {boolean}
 */
function isAdmin() {
    // 1. Existe-t-il un jeton ?
    const token = window.localStorage.getItem("authToken");

    // 2. Est-on authentifié ?
    if (isAuthenticated()) {
        // 3. Le rôle est-il celui attendu ?
        const { roles } = jwtDecode(token);

        return roles === "ROLE_ADMIN";
    }

    return false;
}

export default {
    authenticate,
    logout,
    setUp,
    isAuthenticated,
    isAdmin
}

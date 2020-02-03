import axios from "axios";
import Cache from "./cache";
import { USERS_API } from "./config";

function register(user) {
    return axios.post(USERS_API, user);
}

async function findAll() {
    const cachedUsers = await Cache.get("users");

    if (cachedUsers) return cachedUsers;

    return axios
        .get(USERS_API)
        .then(response => {
            const users = response.data["hydra:member"];
            Cache.set("users", users);

            return users;
        })
    ;
}

async function remove(id) {
    return axios
        .delete(USERS_API + "/" + id)
        .then(async response => {
            const cachedUsers = await Cache.get("users");

            if (cachedUsers) {
                Cache.set("users", cachedUsers.filter(u => u.id !== id));
            }

            return response;
        })
    ;
}

export default {
    register,
    findAll,
    remove
}

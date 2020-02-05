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

async function find(id) {
    const cachedUser = await Cache.get("users." + id);

    if (cachedUser) return cachedUser;

    return axios
        .get(USERS_API + "/" + id)
        .then(response => {
            Cache.set("users." + id, response.data);

            return response.data;
        })
    ;
}

function update(id, user) {
    return axios
        .put(USERS_API + "/" + id, {
            ...user,
            roles: [user.roles]
        })
        .then(async response => {
            const cachedUsers = await Cache.get("users");
            const cachedUser = await Cache.get("users." + id);

            if (cachedUser) {
                Cache.set("users." + id, response.data);
            }

            if (cachedUsers) {
                const index = cachedUsers.findIndex(u => u.id === +id);
                cachedUsers[index] = response.data;
            }

            return response.data;
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
    find,
    update,
    remove
}

import axios from "axios";

function register(user) {
    return axios.post(
        "http://localhost:8000/api/user",
        user
    );
}

export default {
    register
}

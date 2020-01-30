import axios from "axios";
import Cache from "./cache";
import { INVOICES_API } from "./config";

async function findAll() {
    const cachedInvoices = await Cache.get("invoices");

    if (cachedInvoices) return cachedInvoices;

    return axios
        .get(INVOICES_API)
        .then(response => {
            const invoices = response.data["hydra:member"];
            Cache.set("invoices", invoices);

            return invoices;
        });
}

async function find(id) {
    const cachedInvoice = await Cache.get("invoices." + id);

    if (cachedInvoice) return cachedInvoice;

    return axios
        .get(INVOICES_API + "/" + id)
        .then(response => {
            Cache.set("invoices." + id, response.data);

            return response.data
        })
    ;
}

function create(invoice) {
    return axios
        .post(INVOICES_API, {
            ...invoice,
            customer: `/api/customers/${invoice.customer}`
        })
        .then(async response => {
            const cachedInvoices = await Cache.get("invoices");

            if (cachedInvoices) {
                Cache.set("invoices", [...cachedInvoices, response.data]);
            }

            return response;
        })
    ;
}

function update(id, invoice) {
    return axios
        .put(INVOICES_API + "/" + id, {
            ...invoice,
            customer: `/api/customers/${invoice.customer}`
        })
        .then(async response => {
            const cachedInvoices = await Cache.get("invoices");
            const cachedInvoice = await Cache.get("invoices." + id);

            if (cachedInvoice) {
                Cache.set("invoices." + id, response.data);
            }

            if (cachedInvoices) {
                const index = cachedInvoices.findIndex(i => i.id === +id);
                cachedInvoices[index] = response.data;
            }

            return response.data;
        })
    ;
}

function remove(id) {
    return axios
        .delete(INVOICES_API + "/" + id)
        .then(async response => {
            const cachedInvoices = await Cache.get("invoices");

            if (cachedInvoices) {
                Cache.set("invoices", cachedInvoices.filter(i => i.id !== id));
            }

            return response;
        })
    ;
}

export default {
    findAll,
    find,
    create,
    update,
    remove
}

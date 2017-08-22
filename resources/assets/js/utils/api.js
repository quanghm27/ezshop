import axios from 'axios';

const getErrors = error => {
    let msgs = [];
    if (error.response && error.response.data) {
        if (error.response.data.constructor !== Array) return [];
        for (const key of Object.keys(error.response.data)) {
            msgs = [...msgs, ...error.response.data[key]];
        }
    }
    return msgs;
};

export default {
    get(uri) {
        return axios.get(uri)
            .then(response => Promise.resolve(response.data))
            .catch(error => Promise.reject(getErrors(error)));
    },
    post(uri, data) {
        return axios.post(uri, data)
            .then(response => Promise.resolve(response.data))
            .catch(error => Promise.reject(getErrors(error)));
    },
    delete(uri) {
        return axios.delete(uri)
            .then(response => Promise.resolve(response.data))
            .catch(error => Promise.reject(getErrors(error)));
    }
}
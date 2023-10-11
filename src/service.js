import axios from "axios";

const url = `http://localhost:8000/api/v1`;

export async function getLCStore() {
    try {
        var res = await axios.get(`${url}/store`, { timeout: 100000 });
        return res.data;
    } catch (error) {
        return error;
    }
}


export async function getLCUpdates(page) {
    try {
        var res = await axios.get(`${url}/update/${page}`, { timeout: 100000 });
        return res.data;
    } catch (error) {
        return error;
    }
}

export function shortValue(value) {
    if (Array.isArray(value)) {
        return `[_;${value.length}]`
    }
    else if (typeof value === 'object' && value !== null) {
        let res = Object.keys(value).filter(e => e[0] != '_').map(e => `${e}: any`);
        let array = [];
        if (res.length > 2) {
            array = [...res.slice(0, 1), '...', ...res.slice(-1)];
        }
        else array = res;
        return ` {${array.join(" , ")}} `;
    } else {
        let res = `${value}`;
        if (res.length > 10) return res.substring(0, 10) + '...';
        return res;
    }
}
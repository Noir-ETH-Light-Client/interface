import axios from "axios";

const url = `http://localhost:8000/api/v1`;

export async function getLCStore() {
    try {
        var res = await axios.get(`${url}/store`, { timeout: 100000 });
        console.log(res.data)
        return res.data;
    } catch (error) {
        return {
            error: 'error server'
        }
    }
}


export async function getLCUpdates(period) {
    try {
        var res = await axios.get(`${url}/update/${period}`, { timeout: 100000 });
        console.log(res.data)
        return res.data;
    } catch (error) {
        return {
            error: 'error server'
        }
    }
}

export async function getLCProof(lcUpdateId) {
    try {
        var res = await axios.get(`${url}/proof/${lcUpdateId}`, { timeout: 100000 });
        console.log(res.data)
        return res.data;
    } catch (error) {
        return {
            error: 'error server'
        }
    }
}


export function shortValue(value) {
    if (Array.isArray(value)) {
        return `[...]`
    }
    else if (typeof value === 'object' && value !== null) {
        return `{...}`;
    } else {
        let res = `${value}`;
        if (res.length > 10) return res.substring(0, 10) + '...';
        return res;
    }
}


export async function processLCUpdate(contract, lcProof) {
    try {

        lcProof = arrayNumberToUint8Array(lcProof);
        // var data = {
        //     finalityProof: lcProof.finality_proof.sliced_proof,
        //     finalityData: lcProof.finality_proof.public_inputs,
        //     nextSyncCommProof: lcProof.next_sync_committee_proof.sliced_proof,
        //     nextSyncCommData: lcProof.next_sync_committee_proof.public_inputs,
        //     lcUpdateProof: lcProof.lc_update_proof.sliced_proof,
        //     lcUpdateData: lcProof.lc_update_proof.public_inputs,
        //     nextPubkeys: lcProof.next_pubkeys
        // }
        var data = [
            lcProof.finality_proof.sliced_proof,
            lcProof.finality_proof.public_inputs,
            lcProof.next_sync_committee_proof.sliced_proof,
            lcProof.next_sync_committee_proof.public_inputs,
            lcProof.lc_update_proof.sliced_proof,
            lcProof.lc_update_proof.public_inputs,
            lcProof.next_pubkeys
        ]
        console.log(data)
        let tx = await contract.processLCUpdate(data, { gasLimit: 8000000 });
        let res = await tx.wait()
        console.log('res:', res)
    } catch (error) {
        return error;
    }
}


export function arrayNumberToUint8Array(obj) {
    let res = {};
    let check = 0;
    if (Array.isArray(obj)) {
        if (obj[0] != null && Array.isArray(obj[0])) res = [];
        else {
            res = Uint8Array.from(obj); check = 1;
        }
    }
    if (!check) {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                let value = obj[key]
                if (typeof value == 'object') res[key] = arrayNumberToUint8Array(value);
                else res[key] = value
            }
        }
    }
    return res;
}

export function convertContractObject(obj) {
    if (typeof obj == 'object') {
        var res = {};
        if (typeof obj.toBigInt == 'function') return obj.toBigInt();
        else if (Array.isArray(obj)) {
            let keys = Object.keys(obj);
            if (obj.length == keys.length) {
                for (const key of keys) res[convertKey(key)] = convertContractObject(obj[key])
            }
            else {
                for (let i = keys.length / 2; i < keys.length; i++) {
                    let key = keys[i];
                    res[convertKey(key)] = convertContractObject(obj[key]);
                }
            }
        }
        else {
            let keys = Object.keys(obj);
            for (const key of keys) res[convertKey(key)] = convertContractObject(obj[key]);
        }
        return res;
    }
    else return obj;
}

function convertKey(key) {
    if (typeof key == 'string') {
        if (key.length == 0) return key;
        const firstChar = key.charAt(0);
        const restOfString = key.slice(1);

        const capitalizedString = firstChar.toUpperCase() + restOfString;

        const regex = /[A-Z][a-z]*/g;
        const matches = capitalizedString.match(regex);

        return matches.join(" ");
    }
    else return key;
}


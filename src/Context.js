import React, { createContext, useState, useEffect } from 'react';

import { ethers } from 'ethers';
import artifact from "./abi/LightClientStore.json";

const UserContext = createContext();
const ContractAddress = '0x8CD87ae6bA719A4Ccf6A40Ee55B3708A9a27EbFf'

function UserProvider({ children }) {
    var [account, setAccount] = useState(null);
    var [sendContract, setSendContract] = useState(null);
    var [callContract, setCallContract] = useState(null);
    var [provider, setProvider] = useState(null);
    var [cntUpdate, setCntUpdate] = useState(0);

    useEffect(() => {
        const main = async () => {
            provider = (window.ethereum != null) ? new ethers.providers.Web3Provider(window.ethereum) : ethers.providers.getDefaultProvider();
            setProvider(provider);
            let network = await provider.getNetwork();
            if (network.name == 'goerli') {
                callContract = new ethers.Contract(ContractAddress, artifact.abi, provider);
                setCallContract(callContract);
            }
            else {
                alert("Please switch to goerli network");
            }
        }
        main();
    }, [])

    useEffect(() => {
        const main = async () => {
            if (account != null) {
                sendContract = new ethers.Contract(ContractAddress, artifact.abi, account);
                setSendContract(sendContract);
            }
        }
        main();
    }, [account])


    return (
        <UserContext.Provider value={{ account, setAccount, sendContract, callContract, provider, cntUpdate, setCntUpdate }}>
            {children}
        </UserContext.Provider>
    );
}

export { UserContext, UserProvider };


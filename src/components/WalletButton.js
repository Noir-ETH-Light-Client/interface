import { useContext, useEffect, useState } from "react";
import { UserContext } from "../Context";


function WalletButton() {
    var { account, setAccount, provider } = useContext(UserContext);
    var [address, setAddress] = useState();

    useEffect(() => {
        const main = async () => {
            if (account != null) {
                let address = await account.getAddress();
                setAddress(address)
            }

        }
        main()
    }, [account])

    return <div style={{ marginBottom: '20px', display: 'flex' }}>
        {account == null ?
            <button class='btn wallet' onClick={() => {
                if (window.ethereum) {
                    provider.send("eth_requestAccounts", []).then(async () => {
                        setAccount(provider.getSigner());
                    })
                } else {
                    alert("Please Install Metamask!!!");
                }
            }}>
                <strong>Connect Wallet</strong>
            </button> :
            <h2>Hello: {address}</h2>
        }
    </div>
}

export default WalletButton;
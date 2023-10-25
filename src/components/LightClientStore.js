import { useEffect, useState, useContext } from "react";
import { convertContractObject, getLCStore } from "../service";
import { UserContext } from "../Context";
import Entry from "./Entry";
import Loading from "./Loading";

function LightClientStore() {
    var [loadingStore, setLoadingStore] = useState(true);
    var [loadingContractStore, setLoadingContractStore] = useState(true);
    var [lcStore, setLcStore] = useState(null);
    var [contractLcStore, setContractLcStore] = useState(null);
    var { callContract, cntUpdate, minWidth } = useContext(UserContext);

    useEffect(() => {
        const main = async () => {
            setLoadingStore(true);
            lcStore = await getLCStore();
            console.log(lcStore);
            setLcStore(lcStore);
            setLoadingStore(false);
        }
        main();
    }, [])

    useEffect(() => {
        const main = async () => {
            setLoadingContractStore(true);
            if (callContract != null) {
                let syncCommitee = await callContract.queryCurrentSyncCommitee();
                let bestValidUpdate = await callContract.queryCurrentBestValidUpdate();
                let finalizeHeader = await callContract.finalizeHeader();
                let optimisticHeader = await callContract.optimisticHeader();
                let maxActiveParticipants = await callContract.queryCurrentMaxActiveParticipants();

                setContractLcStore(convertContractObject({
                    finalizeHeader,
                    optimisticHeader,
                    syncCommitee,
                    bestValidUpdate,
                    maxActiveParticipants
                }))

            }

            setLoadingContractStore(false);
        }
        main();
    }, [cntUpdate, callContract])

    return <div class="container" style={{ marginBottom: '20px' }}>
        <h1>Contract Light Client Store</h1>

        {loadingStore || contractLcStore == null ? <Loading></Loading> :
            <div class="lc-store">
                {
                    Object.keys(contractLcStore).map((key, i) => {
                        let value = contractLcStore[key];
                        var marginRight = (i % 2 == 0 && minWidth >= 1200) ? '20px' : '0';
                        return <div class='entry lc-store-detail' style={{ marginRight: marginRight }}>
                            <Entry name={key} value={value} isOpen={true}>
                            </Entry>
                        </div>

                    })
                }

            </div>}

    </div>

}

export default LightClientStore;
import { useEffect, useState, useContext } from "react";
import { getLCStore } from "../service";
import { UserContext } from "../Context";
import Entry from "./Entry";
import Loading from "./Loading";

function LightClientStore() {
    var [loadingStore, setLoadingStore] = useState(true);
    var [loadingContractStore, setLoadingContractStore] = useState(true);
    var [lcStore, setLcStore] = useState(null);
    var [contractLcStore, setContractLcStore] = useState(null);
    var { callContract, cntUpdate } = useContext(UserContext);

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
                let sync_commitee = await callContract.queryCurrentSyncCommitee();
                let best_valid_update = await callContract.queryCurrentBestValidUpdate();
                let finalize_header = await callContract.finalizeHeader();
                let optimistic_header = await callContract.optimisticHeader();
                let max_active_participants = await callContract.queryCurrentMaxActiveParticipants();
                setContractLcStore({
                    sync_commitee,
                    best_valid_update,
                    finalize_header,
                    optimistic_header,
                    max_active_participants
                })
                console.log(34)
            }

            setLoadingContractStore(false);
        }
        main();
    }, [cntUpdate, callContract])

    return <div class="lc-store">
        <div class="container" style={{ marginRight: '20px' }}>
            <h1>Contract Light Client Store</h1>
            <div class="entry">
                {loadingStore || contractLcStore == null ? <Loading></Loading> : <Entry name="Light Client Store" value={contractLcStore} isOpen={true}></Entry>}
            </div>


        </div>
        <div class="container">
            <h1>Backend Light Client Store</h1>
            <div class="entry">
                {loadingContractStore || lcStore == null ? <Loading></Loading> : <Entry name="Light Client Store" value={lcStore} isOpen={true}></Entry>}
            </div>
        </div>
    </div>

}

export default LightClientStore;
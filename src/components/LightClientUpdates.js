import { useContext, useEffect, useState } from "react";
import { getLCProof, getLCUpdates, processLCUpdate } from "../service";
import { UserContext } from "../Context";
import Entry from "./Entry";
import Loading from "./Loading";

function LightClientUpdates() {
    var [loadingUpdates, setLoadingUpdates] = useState(true);
    var [lcUpdates, setLcUpdates] = useState(null);
    var [signatureSlot, setSignatureSlot] = useState(null);
    var [currentPeriod, setCurrentPeriod] = useState(null);
    var [percent, setPercent] = useState(0);
    var { callContract, cntUpdate } = useContext(UserContext);

    useEffect(() => {
        const main = async () => {
            if (callContract != null) {
                setLoadingUpdates(true);
                try {
                    signatureSlot = Number((await callContract.queryCurrentBestValidUpdate()).summary.signatureSlot);
                    currentPeriod = Math.floor(signatureSlot / 8192);
                    setCurrentPeriod(currentPeriod);
                    setSignatureSlot(signatureSlot);
                }
                catch (e) {
                    alert(e)
                }
                setLoadingUpdates(false);
            }

        }
        main();
    }, [callContract, cntUpdate])

    useEffect(() => {
        const main = async () => {
            if (signatureSlot != null) {
                setLoadingUpdates(true);
                lcUpdates = await getLCUpdates(signatureSlot);
                if (lcUpdates.error != null) alert("LC updates error:" + lcUpdates.error);
                else {
                    let oldest = Math.floor(lcUpdates.oldest.signature_slot / 8192);
                    let newest = Math.floor(lcUpdates.newest.signature_slot / 8192);
                    percent = Math.floor((currentPeriod - oldest + 1) / (newest - oldest + 1) * 1000);
                    console.log("percent:" + percent)
                    setPercent(percent)
                    setLcUpdates(lcUpdates);
                }
                setLoadingUpdates(false);

            }
        }
        main();
    }, [signatureSlot, cntUpdate])

    return <div class="container" style={{ marginBottom: '20px' }}>
        <h1>Light Client Updates</h1>
        {!loadingUpdates && lcUpdates != null && <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div class='lc-updates' style={{ flexBasis: '1' }}>
                {lcUpdates.preType > 0 && <LightClientUpdate obj={lcUpdates.oldest} currentPeriod={currentPeriod}></LightClientUpdate>}
                {lcUpdates.preType > 2 && <Line type={2}></Line>}
                {lcUpdates.preType > 2 && <i class="fa fa-arrow-circle-o-left arrow-icon" onClick={() => setSignatureSlot(lcUpdates.less.signature_slot)}></i>}
                {lcUpdates.preType > 2 && <Line type={2}></Line>}
                {lcUpdates.preType <= 2 && lcUpdates.preType >= 1 && <Line type={1}></Line>}
                {lcUpdates.preType > 1 && <LightClientUpdate obj={lcUpdates.less} currentPeriod={currentPeriod}></LightClientUpdate>}
                {lcUpdates.preType > 1 && lcUpdates.preType >= 1 && <Line type={1}></Line>}
                {lcUpdates.current != null && <LightClientUpdate obj={lcUpdates.current} currentPeriod={currentPeriod}></LightClientUpdate>}
                {lcUpdates.sufType > 1 && lcUpdates.sufType >= 1 && <Line type={1}></Line>}
                {lcUpdates.greater != null && <LightClientUpdate obj={lcUpdates.greater} currentPeriod={currentPeriod}></LightClientUpdate>}
                {lcUpdates.sufType > 2 && <Line type={2}></Line>}
                {lcUpdates.sufType > 2 && <i class="fa fa-arrow-circle-o-right arrow-icon" onClick={() => setSignatureSlot(lcUpdates.greater.signature_slot)}></i>}
                {lcUpdates.sufType > 2 && <Line type={2}></Line>}
                {lcUpdates.sufType <= 2 && lcUpdates.sufType >= 1 && <Line type={1}></Line>}
                {lcUpdates.newest != null && <LightClientUpdate obj={lcUpdates.newest} currentPeriod={currentPeriod}></LightClientUpdate>}
            </div>


            <svg class="percent" style={{ flexGrow: '1', width: '100%' }}>
                <rect x="0" y="0" width="100%" height="30" fill="#497ccf" />
                <rect x="0" y="0" width={`${percent / 10}%`} height="30" fill="#2AB56F" />
            </svg>
        </div>}


        {!loadingUpdates && <h3>{percent / 10} %</h3>}
        {loadingUpdates && <Loading></Loading>}
    </div>
}

function LightClientUpdate({ obj, currentPeriod }) {
    let [open, setOpen] = useState(false);
    let [loading, setLoading] = useState(0)
    let period = Math.floor(Number(obj.signature_slot) / 8192)
    let { sendContract, account, setCntUpdate, cntUpdate } = useContext(UserContext)
    let status = obj.is_on_contract ? "done" : "pending";

    return <div class={`lc-update ${status}`} onMouseEnter={() => { if (open == false) setOpen(true) }} onMouseLeave={() => setOpen(false)} >
        {period == currentPeriod + 1 &&
            <div class="arrow">
                {loading == 0 && <button class='btn' onClick={async () => {
                    if (account != null) {
                        setLoading(1)
                        let proof = await getLCProof(obj._id);
                        if (proof.error != null) alert("Proof error:" + proof.error);
                        else {
                            setLoading(2);
                            await processLCUpdate(sendContract, proof);
                            setCntUpdate(++cntUpdate)
                        }
                        setLoading(0)
                    }
                    else alert("Please connect wallet");

                }}>Push to contract</button>}
                {loading == 1 &&
                    <button class="btn">
                        <i class="fa fa-spinner fa-spin"></i> Generating
                    </button>
                }
                {loading == 2 &&
                    <button class="btn">
                        <i class="fa fa-spinner fa-spin"></i> Verifying
                    </button>
                }
                <i class="fa fa-arrow-down"></i>
            </div>}
        <h3>period {period}</h3>
        {open &&
            <div class="lc-update-wrapper">
                <div style={{ height: '20px' }}></div>
                <div class='lc-update-detail'>
                    <div style={{ display: 'flex' }}>
                        <h2>{`LC Update at period ${period}`}</h2>
                        <h2 class='cancel' style={{ marginLeft: 'auto' }} onClick={() => setOpen(false)}>X</h2>
                    </div>
                    <div class="entry">
                        <Entry name={obj.is_on_contract ? "Sync LC Update" : "Pending LC Update"} value={obj} isOpen={true}></Entry>
                    </div>

                </div>
            </div>
        }
    </div>
}

function Line({ type }) {
    return <svg width={type == 1 ? "100" : '50'}>
        {type == 1 && <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#fff" stroke-width="3" />}
        {type == 2 && <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#fff" stroke-width="3" stroke-dasharray="6" />}
    </svg>
}

export default LightClientUpdates;
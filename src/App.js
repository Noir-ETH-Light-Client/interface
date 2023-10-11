import { useEffect, useState } from "react";
import { getLCStore, getLCUpdates } from "./service";
import Entry from "./Object";
function App() {
  var [page, setPage] = useState(1);
  var [loadingStore, setLoadingStore] = useState(true);
  var [loadingUpdates, setLoadingUpdates] = useState(true);
  var [lcStore, setLcStore] = useState();
  var [lcUpdates, setLcUpdates] = useState([]);

  useEffect(() => {
    const main = async () => {
      setLoadingStore(true);
      lcStore = await getLCStore();
      setLcStore(lcStore);
      setLoadingStore(false);
    }
    main();
  }, [])

  useEffect(() => {
    const main = async () => {
      setLoadingUpdates(true);
      lcUpdates = await getLCUpdates(page);
      setLcUpdates(lcUpdates);
      setLoadingUpdates(false);
    }
    main();
  }, [page])

  return (
    <div class="flex" style={{ height: '100vh' }}>
      <div style={{ padding: '20px', flex: '1' }}>

        <div style={{ marginBottom: '20px', fontWeight: 'bold', fontSize: '20px' }}>Light Client Store</div>

        {loadingStore ? <div className="loader" /> : <div style={{ border: '1px solid black', borderRadius: '5px', padding: '5px' }}>
          <Entry name="LCStore" value={lcStore}></Entry>
        </div>}


      </div>

      <div style={{ flex: '1', padding: '20px', borderLeft: '1px solid black' }}>


        <div class='flex' style={{ alignItems: 'center', alignContent: 'center', marginBottom: '20px' }}>
          <div style={{ fontWeight: 'bold', fontSize: '20px' }}>Light Client Updates</div>
          <input style={{ marginLeft: 'auto', width: '30px' }} type="number" value={page} onChange={(e) => setPage(e.target.value)}></input>
        </div>
        {loadingUpdates ? <div className="loader" /> : <div>
          {lcUpdates.map((e, i) =>
            <div style={{ border: '1px solid black', borderRadius: '5px', padding: '5px', marginBottom: '10px' }}>
              <Entry name={`LCUpdate ${i + parseInt(page.toString()) * 5 - 4}`} value={e}></Entry>
            </div>

          )}
        </div>}
      </div>

    </div>
  );
}

export default App;

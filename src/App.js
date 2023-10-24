import LightClientStore from "./components/LightClientStore";
import LightClientUpdates from "./components/LightClientUpdates";
import WalletButton from "./components/WalletButton";

function App() {

  return (
    <div style={{ padding: '40px' }}>
      <WalletButton></WalletButton>
      <LightClientUpdates></LightClientUpdates>
      <LightClientStore></LightClientStore>
    </div>

  );
}

export default App;

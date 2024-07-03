import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import { useState } from "react";
import server from "./server";

function App() {
  const [userInfo, setUserInfo] = useState({
    privateKey: "",
    publicKey: "",
    walletAddress: "",
    balance: 0,
  });

  const handleBalanceChange = (balance) => {
    setUserInfo((userInfo) => ({ ...userInfo, balance }));
  };

  const handleCreateWallet = async () => {
    const res = await server.post("/create");

    console.log("New wallet has been created!", res);
  };

  return (
    <div className="app">
      <button
        type="button"
        className="create-button"
        onClick={handleCreateWallet}
      >
        Create
      </button>
      <div className="main-container">
        <Wallet userInfo={userInfo} setUserInfo={setUserInfo} />
        <Transfer onBalanceChange={handleBalanceChange} userInfo={userInfo} />
      </div>
    </div>
  );
}

export default App;

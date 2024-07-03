import { useState } from "react";

import server from "./server";
import { walletUtils } from "./utils";
import { toHex } from "ethereum-cryptography/utils";

function Wallet({ userInfo, setUserInfo }) {
  const [error, setError] = useState();
  const { walletAddress, balance } = userInfo;

  async function onChange(evt) {
    try {
      const { getPublicKey, getWalletAddress } = walletUtils;

      const privateKey = evt.target.value;

      const publicKey = getPublicKey(privateKey);
      const walletAddress = `0x${toHex(getWalletAddress(publicKey))}`;

      if (privateKey) {
        const {
          data: { balance },
        } = await server.get(`balance/${walletAddress}`);

        setUserInfo({
          privateKey,
          publicKey: toHex(publicKey),
          walletAddress,
          balance,
        });
        setError();
      }
    } catch (err) {
      setUserInfo((userInfo) => ({ ...userInfo, balance: 0 }));
      setError(err.response.data.message);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>
      <label>
        Private Key
        <input
          style={{ marginTop: "8px" }}
          placeholder="Enter an Private Key"
          onChange={onChange}
        />
        {error ? <span className="error">{error}</span> : null}
      </label>
      <div className="balance">
        Wallet Address: <strong>{walletAddress}</strong>
      </div>
      <div className="balance">
        Balance: <strong>{balance}</strong>
      </div>
    </div>
  );
}

export default Wallet;

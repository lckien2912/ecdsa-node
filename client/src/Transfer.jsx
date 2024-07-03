import { useState } from "react";
import server from "./server";
import { secp256k1 } from "ethereum-cryptography/secp256k1.js";
import { keccak256 } from "ethereum-cryptography/keccak.js";
import { utf8ToBytes, toHex } from "ethereum-cryptography/utils";

function Transfer({ onBalanceChange, userInfo }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function signMessage(e) {
    e.preventDefault();

    try {
      const hashMessage = toHex(
        keccak256(utf8ToBytes("Sign message to transfer"))
      );
      const signMessage = secp256k1.sign(hashMessage, userInfo.privateKey);

      const transformSignMessage = {
        r: signMessage.r.toString(),
        s: signMessage.s.toString(),
        recovery: signMessage.recovery,
      };

      const { data } = await server.post("verify", {
        msg: hashMessage,
        signMessage: transformSignMessage,
        sender: userInfo.publicKey,
      });

      if (!data) {
        throw new Error("Invalid signature");
      }

      await transfer();
    } catch (error) {
      console.log(error);
    }
  }

  async function transfer() {
    try {
      const {
        data: { balance },
      } = await server.post("send", {
        sender: userInfo.walletAddress,
        amount: parseInt(sendAmount),
        recipient,
      });

      onBalanceChange(balance);
    } catch (ex) {
      console.log(ex);
    }
  }

  return (
    <form className="container transfer" onSubmit={signMessage}>
      <h1>Send Transaction</h1>
      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        />
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        />
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;

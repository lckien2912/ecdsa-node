const express = require("express");
const app = express();

const fs = require("fs");
const {
  createNewWallet,
  getUserWallet,
  verifySignature,
} = require("./services/wallet");

const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const walletData = JSON.parse(
  fs.readFileSync("./database/wallet.json", "utf8")
);

app.get("/wallet", (req, res) => {
  res.send(walletData);
});

app.post("/create", (req, res) => {
  const newWallet = createNewWallet();

  walletData.push(newWallet);
  const newWalletData = walletData;

  fs.writeFile(
    "./database/wallet.json",
    JSON.stringify(newWalletData),
    (err) => {
      if (err) throw err;
    }
  );

  res.send({ newWallet });
});

app.get("/balance/:address", (req, res, next) => {
  try {
    const { address } = req.params;
    const userWallet = walletData.find((w) => w.walletAddress === address);

    if (!userWallet) {
      return res.status(404).send({ message: "Wallet not found!" });
    }

    const balance = userWallet.balance || 0;

    return res.send({ balance });
  } catch (e) {
    next(e);
  }
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount } = req.body;

  const senderWallet = getUserWallet(sender, walletData);
  const recipientWallet = getUserWallet(recipient, walletData);

  if (senderWallet.balance < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    senderWallet.balance -= amount;
    recipientWallet.balance += amount;

    const newWalletData = walletData;
    fs.writeFile(
      "./database/wallet.json",
      JSON.stringify(newWalletData),
      (err) => {
        if (err) throw err;
      }
    );

    res.send(senderWallet);
  }
});

app.post("/verify", (req, res) => {
  const { msg, signMessage, sender } = req.body;

  res.send(verifySignature(signMessage, msg, sender));
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

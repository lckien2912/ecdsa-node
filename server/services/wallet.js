const { toHex } = require("ethereum-cryptography/utils.js");
const { secp256k1 } = require("ethereum-cryptography/secp256k1.js");

const {
  generatePrivateKey,
  getPublicKey,
  getWalletAddress,
} = require("./generateKey.js");

function getUserWallet(address, data) {
  const userWallet = data.find((w) => w.walletAddress === address);

  if (!userWallet) {
    const newWallet = createNewWallet();
    data.push(newWallet);

    const newWalletData = walletData;

    fs.writeFile(
      "./database/wallet.json",
      JSON.stringify(newWalletData),
      (err) => {
        if (err) throw err;
      }
    );

    return newWallet;
  }

  return userWallet;
}

function createNewWallet() {
  const privateKey = generatePrivateKey();
  const publicKey = getPublicKey(privateKey);
  const walletAddress = `0x${toHex(getWalletAddress(publicKey))}`;

  return {
    privateKey: toHex(privateKey),
    publicKey: toHex(publicKey),
    walletAddress,
    balance: 0,
  };
}

function verifySignature(signature, msg, publicKey) {
  const { verify, Signature } = secp256k1;

  const signMessage = new Signature(
    BigInt(signature.r),
    BigInt(signature.s),
    signature.recovery
  );

  return verify(signMessage, msg, publicKey);
}

module.exports = {
  getUserWallet,
  createNewWallet,
  verifySignature,
};

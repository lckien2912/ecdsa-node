const { secp256k1 } = require("ethereum-cryptography/secp256k1.js");
const { keccak256 } = require("ethereum-cryptography/keccak.js");

const generatePrivateKey = () => {
  return secp256k1.utils.randomPrivateKey();
};

const getPublicKey = (privateKey) => {
  return secp256k1.getPublicKey(privateKey);
};

const getWalletAddress = (publicKey) => {
  return keccak256(publicKey.slice(1)).slice(-20);
};

module.exports = {
  generatePrivateKey,
  getPublicKey,
  getWalletAddress,
};

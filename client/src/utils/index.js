import { secp256k1 } from "ethereum-cryptography/secp256k1.js";
import { keccak256 } from "ethereum-cryptography/keccak.js";

const generatePrivateKey = () => {
  return secp256k1.utils.randomPrivateKey();
};

const getPublicKey = (privateKey) => {
  return secp256k1.getPublicKey(privateKey);
};

const getWalletAddress = (publicKey) => {
  return keccak256(publicKey.slice(1)).slice(-20);
};

export const walletUtils = {
  generatePrivateKey,
  getPublicKey,
  getWalletAddress,
};

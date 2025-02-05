import { ethers } from 'ethers'
import ElectionFactABI from './ElectionFact.json'
import ElectionABI from './Election.json'

const CONTRACT_ADDRESS = '0x1889E22EfAd2E2c04F1e93ad111336EdCF6535c2'

export const getElectionFactContract = () => {
  if (!window.ethereum) {
    alert("Metamask tidak ditemukan!");
    return;
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  console.log(provider)
  const signer = provider.getSigner();
  console.log(signer)
  return new ethers.Contract(CONTRACT_ADDRESS, ElectionFactABI.abi, signer);
}

export const getElectionContract = (address) => {
  if (!window.ethereum) {
    alert("Metamask tidak ditemukan!");
    return;
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  console.log(provider)
  const signer = provider.getSigner();
  console.log(signer)
  return new ethers.Contract(address, ElectionABI.abi, signer);
}
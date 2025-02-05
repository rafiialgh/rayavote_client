import { ethers } from 'ethers'
import ElectionFactABI from './ElectionFact.json'

const CONTRACT_ADDRESS = '0x6dC2560CDFb10d5739Acc689428b9af1fc758574'

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
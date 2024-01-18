import React, { useState } from "react";
import { ethers } from "ethers";

const ConnectWallet = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [userAddress, setUserAddress] = useState("");

  const connectWalletHandler = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        const provider = new ethers.providers.Web3Provider(window.ethereum);

        const signer = provider.getSigner();

        setIsConnected(true);
        setUserAddress(await signer.getAddress());

        console.log("Connected", userAddress);
      } catch (error) {
        console.error("Error connecting to MetaMask", error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  return (
    <div className="connect-wallet">
      <button onClick={connectWalletHandler}>
        {isConnected ? "Connected" : "Connect Wallet"}
      </button>
    </div>
  );
};

export default ConnectWallet;

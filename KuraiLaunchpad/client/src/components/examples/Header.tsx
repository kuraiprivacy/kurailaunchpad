import { useState } from "react";
import Header from "../Header";

export default function HeaderExample() {
  const [walletAddress, setWalletAddress] = useState<string>();

  const handleConnect = () => {
    console.log("Connect wallet triggered");
    setWalletAddress("9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin");
  };

  const handleDisconnect = () => {
    console.log("Disconnect wallet triggered");
    setWalletAddress(undefined);
  };

  return (
    <Header 
      walletAddress={walletAddress}
      onConnectWallet={handleConnect}
      onDisconnectWallet={handleDisconnect}
    />
  );
}

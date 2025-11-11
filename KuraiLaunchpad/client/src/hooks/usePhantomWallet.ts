import { useState, useEffect } from "react";
import { connectPhantom, disconnectPhantom, getPhantomProvider } from "@/lib/phantom";

export const usePhantomWallet = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    const provider = getPhantomProvider();
    if (!provider) return;

    if (provider.isConnected && provider.publicKey) {
      setWalletAddress(provider.publicKey.toString());
    }

    const handleAccountChanged = (publicKey: any) => {
      if (publicKey) {
        setWalletAddress(publicKey.toString());
      } else {
        setWalletAddress(null);
      }
    };

    const handleDisconnect = () => {
      setWalletAddress(null);
    };

    provider.on("accountChanged", handleAccountChanged);
    provider.on("disconnect", handleDisconnect);

    return () => {
      provider.removeListener("accountChanged", handleAccountChanged);
      provider.removeListener("disconnect", handleDisconnect);
    };
  }, []);

  const connect = async () => {
    setConnecting(true);
    const address = await connectPhantom();
    if (address) {
      setWalletAddress(address);
    }
    setConnecting(false);
  };

  const disconnect = async () => {
    await disconnectPhantom();
    setWalletAddress(null);
  };

  return {
    walletAddress,
    connecting,
    connect,
    disconnect,
  };
};

import { PublicKey, Transaction, SendOptions } from "@solana/web3.js";

export interface PhantomProvider {
  isPhantom?: boolean;
  publicKey?: PublicKey;
  isConnected: boolean;
  connect: () => Promise<{ publicKey: PublicKey }>;
  disconnect: () => Promise<void>;
  signTransaction: (transaction: Transaction) => Promise<Transaction>;
  signAllTransactions: (transactions: Transaction[]) => Promise<Transaction[]>;
  signAndSendTransaction: (transaction: Transaction, options?: SendOptions) => Promise<{ signature: string }>;
  on: (event: string, callback: (args: any) => void) => void;
  removeListener: (event: string, callback: (args: any) => void) => void;
}

export const getPhantomProvider = (): PhantomProvider | undefined => {
  if ("solana" in window) {
    const provider = (window as any).solana;
    if (provider.isPhantom) {
      return provider;
    }
  }
  window.open("https://phantom.app/", "_blank");
};

export const connectPhantom = async (): Promise<string | null> => {
  try {
    const provider = getPhantomProvider();
    if (!provider) {
      return null;
    }

    const response = await provider.connect();
    return response.publicKey.toString();
  } catch (error) {
    console.error("Error connecting to Phantom:", error);
    return null;
  }
};

export const disconnectPhantom = async (): Promise<void> => {
  try {
    const provider = getPhantomProvider();
    if (provider) {
      await provider.disconnect();
    }
  } catch (error) {
    console.error("Error disconnecting from Phantom:", error);
  }
};

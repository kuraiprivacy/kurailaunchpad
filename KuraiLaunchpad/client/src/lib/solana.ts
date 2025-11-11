import { Buffer } from "buffer";
if (typeof window !== "undefined") {
  (window as any).Buffer = Buffer;
}

import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL, Keypair } from "@solana/web3.js";
import { getPhantomProvider } from "./phantom";

// Check for custom RPC URL in environment variables
const CUSTOM_RPC = import.meta.env.VITE_SOLANA_RPC;

console.log("🔧 Custom RPC configured:", CUSTOM_RPC ? "✅ Yes" : "❌ No (using free fallback endpoints)");
if (CUSTOM_RPC) {
  console.log("🌐 Using custom RPC endpoint");
}

// Using multiple free RPC endpoints as fallback
// Note: Free endpoints may be rate-limited. For production, use a paid RPC service
const RPC_ENDPOINTS = CUSTOM_RPC ? [CUSTOM_RPC] : [
  "https://rpc.ankr.com/solana",
  "https://solana.public-rpc.com",
  "https://api.mainnet-beta.solana.com",
  "https://solana-api.projectserum.com",
];

console.log("📡 RPC endpoints configured:", RPC_ENDPOINTS.length, "endpoint(s)");

const connection = new Connection(RPC_ENDPOINTS[0], {
  commitment: "confirmed",
  confirmTransactionInitialTimeout: 60000,
});

// Temporary mixing wallet (in production this would be a program/protocol)
const MIXING_WALLET = "9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin";

export const generateLaunchWallet = (): { publicKey: string; privateKey: string } => {
  const keypair = Keypair.generate();
  return {
    publicKey: keypair.publicKey.toBase58(),
    privateKey: Buffer.from(keypair.secretKey).toString("base64"),
  };
};

export const importLaunchWallet = (privateKey: string): { publicKey: string; privateKey: string } | { error: string } => {
  try {
    // Try to parse as base64 first
    let secretKey: Uint8Array;
    
    try {
      secretKey = new Uint8Array(Buffer.from(privateKey, "base64"));
    } catch {
      // Try as JSON array
      secretKey = new Uint8Array(JSON.parse(privateKey));
    }
    
    if (secretKey.length !== 64) {
      return { error: "Invalid private key length. Expected 64 bytes." };
    }
    
    const keypair = Keypair.fromSecretKey(secretKey);
    return {
      publicKey: keypair.publicKey.toBase58(),
      privateKey: Buffer.from(keypair.secretKey).toString("base64"),
    };
  } catch (error: any) {
    return { error: "Invalid private key format. Use base64 or JSON array." };
  }
};

export const getBalance = async (publicKey: string): Promise<number> => {
  try {
    console.log("Getting balance for:", publicKey);
    const pubKey = new PublicKey(publicKey);
    console.log("PublicKey created:", pubKey.toBase58());
    
    // Try multiple RPC endpoints for reliability
    for (let i = 0; i < RPC_ENDPOINTS.length; i++) {
      try {
        console.log(`Trying RPC endpoint ${i + 1}/${RPC_ENDPOINTS.length}:`, RPC_ENDPOINTS[i]);
        const rpcConnection = new Connection(RPC_ENDPOINTS[i], "confirmed");
        const balance = await rpcConnection.getBalance(pubKey);
        console.log(`✅ Balance fetched from ${RPC_ENDPOINTS[i]}:`, balance / LAMPORTS_PER_SOL, "SOL");
        return balance / LAMPORTS_PER_SOL;
      } catch (rpcError: any) {
        console.error(`❌ Failed to get balance from ${RPC_ENDPOINTS[i]}:`, {
          message: rpcError?.message,
          code: rpcError?.code,
          data: rpcError?.data,
          stack: rpcError?.stack?.substring(0, 200),
        });
        if (i === RPC_ENDPOINTS.length - 1) {
          throw rpcError;
        }
      }
    }
    return 0;
  } catch (error: any) {
    console.error("❌ Error getting balance - All RPCs failed:", {
      message: error?.message,
      code: error?.code,
      name: error?.name,
      toString: error?.toString(),
    });
    return 0;
  }
};

export const sendMixTransaction = async (
  amount: number,
  recipientAddress: string
): Promise<{ signature: string; success: boolean; error?: string }> => {
  try {
    const provider = getPhantomProvider();
    if (!provider || !provider.publicKey) {
      return { signature: "", success: false, error: "Wallet not connected" };
    }

    const lamports = amount * LAMPORTS_PER_SOL;
    const recipient = new PublicKey(recipientAddress);

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: provider.publicKey,
        toPubkey: recipient,
        lamports,
      })
    );

    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = provider.publicKey;

    const signed = await provider.signTransaction(transaction);
    const signature = await connection.sendRawTransaction(signed.serialize());
    
    await connection.confirmTransaction({
      signature,
      blockhash,
      lastValidBlockHeight,
    });

    return { signature, success: true };
  } catch (error: any) {
    console.error("Transaction error:", error);
    return { 
      signature: "", 
      success: false, 
      error: error.message || "Transaction failed" 
    };
  }
};

export const mixSOL = async (
  amount: number,
  userWallet: string,
  launchWallet?: string
): Promise<{ success: boolean; depositSignature?: string; returnSignature?: string; error?: string }> => {
  try {
    // Step 1: Send SOL to launch wallet (or mixing wallet if no launch wallet specified)
    const destination = launchWallet || MIXING_WALLET;
    const depositResult = await sendMixTransaction(amount, destination);
    
    if (!depositResult.success) {
      return {
        success: false,
        error: depositResult.error || "Failed to send to launch wallet",
      };
    }

    console.log("Mix transaction successful:", depositResult.signature);
    
    return {
      success: true,
      depositSignature: depositResult.signature,
    };
  } catch (error: any) {
    console.error("Mix error:", error);
    return {
      success: false,
      error: error.message || "Mixing failed",
    };
  }
};

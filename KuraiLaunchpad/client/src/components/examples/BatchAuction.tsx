import { useState } from "react";
import BatchAuction from "../BatchAuction";
import { Button } from "@/components/ui/button";

export default function BatchAuctionExample() {
  const [walletAddress, setWalletAddress] = useState<string>();

  return (
    <div className="p-6 space-y-4">
      {!walletAddress && (
        <Button onClick={() => setWalletAddress("9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin")}>
          Connect Wallet (Demo)
        </Button>
      )}
      <BatchAuction walletAddress={walletAddress} />
    </div>
  );
}

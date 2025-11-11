import { useState } from "react";
import BatchAuction from "@/components/BatchAuction";

export default function BatchAuctionPage() {
  const [walletAddress] = useState<string>("9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin");

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Batch Auction</h1>
        <p className="text-muted-foreground">
          Submit sealed orders for fair price discovery without mempool visibility
        </p>
      </div>
      <BatchAuction walletAddress={walletAddress} />
    </div>
  );
}

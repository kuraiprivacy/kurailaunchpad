import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Lock, Unlock, TrendingUp } from "lucide-react";

interface SealedOrder {
  id: string;
  amount: string;
  maxPrice: string;
  timestamp: number;
  settled: boolean;
}

interface BatchAuctionProps {
  walletAddress?: string;
}

export default function BatchAuction({ walletAddress }: BatchAuctionProps) {
  const [orders, setOrders] = useState<SealedOrder[]>([]);
  const [amount, setAmount] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [batchSettled, setBatchSettled] = useState(false);

  const handleSubmitOrder = () => {
    if (!amount || !maxPrice) return;

    const newOrder: SealedOrder = {
      id: Math.random().toString(36).substring(7),
      amount,
      maxPrice,
      timestamp: Date.now(),
      settled: false,
    };

    setOrders([...orders, newOrder]);
    console.log("Sealed order submitted:", newOrder);
    setAmount("");
    setMaxPrice("");
  };

  const handleSettleBatch = () => {
    setBatchSettled(true);
    setOrders(orders.map(o => ({ ...o, settled: true })));
    console.log("Batch settled");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-primary" />
            <CardTitle>Submit Sealed Order</CardTitle>
          </div>
          <CardDescription>
            Orders remain hidden until batch settlement
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!walletAddress ? (
            <div className="rounded-md border border-border p-6 text-center">
              <p className="text-sm text-muted-foreground">
                Connect your wallet to submit sealed orders
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (SOL)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="10.0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  data-testid="input-order-amount"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxPrice">Max Price per Token</Label>
                <Input
                  id="maxPrice"
                  type="number"
                  placeholder="0.001"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  data-testid="input-order-max-price"
                />
              </div>
              <Button 
                onClick={handleSubmitOrder}
                disabled={!amount || !maxPrice}
                className="w-full"
                data-testid="button-submit-order"
              >
                <Lock className="w-4 h-4 mr-2" />
                Submit Sealed Order
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {orders.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <CardTitle>Your Orders</CardTitle>
              </div>
              {!batchSettled && (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={handleSettleBatch}
                  data-testid="button-settle-batch"
                >
                  <Unlock className="w-4 h-4 mr-2" />
                  Settle Batch
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {orders.map((order) => (
                <div 
                  key={order.id}
                  className="flex items-center justify-between p-4 rounded-md border border-border bg-card"
                  data-testid={`order-${order.id}`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <p className="text-sm font-medium text-foreground">
                        {order.amount} SOL
                      </p>
                      <span className="text-xs text-muted-foreground">•</span>
                      <p className="text-xs text-muted-foreground">
                        Max: {order.maxPrice} per token
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground font-mono">
                      {new Date(order.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <Badge 
                    variant={order.settled ? "default" : "secondary"}
                    data-testid={`badge-order-status-${order.id}`}
                  >
                    {order.settled ? "Settled" : "Sealed"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

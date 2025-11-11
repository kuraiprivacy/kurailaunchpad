import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Wallet, Users, Calendar, TrendingUp } from "lucide-react";

interface EscrowDashboardProps {
  balance?: string;
  released?: string;
  vestingProgress?: number;
  vestingEndDays?: number;
  multisigSigners?: string[];
}

export default function EscrowDashboard({
  balance = "1000000",
  released = "250000",
  vestingProgress = 25,
  vestingEndDays = 135,
  multisigSigners = [
    "9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin",
    "7yHeQ3V8Uz6dREjSx9PMbZ9vTx4KtLqW3zPxNqYrQxMw",
    "5kBbXD2vR9cW8tNx3QPjMaF4yVwH2xZrPqLsNtYuGwJh"
  ]
}: EscrowDashboardProps) {
  const totalAmount = parseFloat(balance) + parseFloat(released);
  const releasedPercent = (parseFloat(released) / totalAmount) * 100;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>Total Escrowed</CardDescription>
              <Wallet className="w-4 h-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground" data-testid="text-total-escrow">
              {totalAmount.toLocaleString()} KURAI
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Developer allocation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>Released</CardDescription>
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-primary" data-testid="text-released-amount">
              {parseFloat(released).toLocaleString()} KURAI
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {releasedPercent.toFixed(1)}% unlocked
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>Vesting Ends</CardDescription>
              <Calendar className="w-4 h-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground" data-testid="text-vesting-days">
              {vestingEndDays} days
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Linear unlock schedule
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vesting Timeline</CardTitle>
          <CardDescription>Token release progress over time</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium text-foreground">{vestingProgress}%</span>
            </div>
            <Progress value={vestingProgress} className="h-2" data-testid="progress-vesting" />
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4">
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Start</p>
              <Badge variant="outline">Day 0</Badge>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Current</p>
              <Badge variant="default">Day 45</Badge>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">End</p>
              <Badge variant="outline">Day 180</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            <CardTitle>Multisig Signers</CardTitle>
          </div>
          <CardDescription>
            {multisigSigners.length} required signers for release approval
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {multisigSigners.map((signer, idx) => (
            <div 
              key={idx}
              className="flex items-center justify-between p-3 rounded-md border border-border bg-card"
              data-testid={`signer-${idx}`}
            >
              <div>
                <p className="text-xs text-muted-foreground mb-1">Signer {idx + 1}</p>
                <p className="text-sm font-mono text-foreground">
                  {signer.slice(0, 8)}...{signer.slice(-8)}
                </p>
              </div>
              <Badge variant="secondary">Active</Badge>
            </div>
          ))}

          <Button className="w-full mt-4" variant="outline" data-testid="button-propose-release">
            Propose Release
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

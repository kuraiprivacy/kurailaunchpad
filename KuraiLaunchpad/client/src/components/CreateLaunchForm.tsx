import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Shuffle, ArrowRight, Shield, CheckCircle2, ExternalLink, History, Clock, Rocket, Copy, Download, Key } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { mixSOL, getBalance, generateLaunchWallet, importLaunchWallet } from "@/lib/solana";
import { useToast } from "@/hooks/use-toast";

interface MixTransaction {
  signature: string;
  amount: number;
  timestamp: number;
  walletAddress: string;
}

interface CreateLaunchFormProps {
  walletAddress: string | null;
}

export default function CreateLaunchForm({ walletAddress }: CreateLaunchFormProps) {
  const [depositAmount, setDepositAmount] = useState("");
  const [usePrivacySwap, setUsePrivacySwap] = useState(true);
  const [mixing, setMixing] = useState(false);
  const [mixResult, setMixResult] = useState<{ signature: string } | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [history, setHistory] = useState<MixTransaction[]>([]);
  const [launchWallet, setLaunchWallet] = useState<{ publicKey: string; privateKey: string } | null>(null);
  const [readyToLaunch, setReadyToLaunch] = useState(false);
  const [importKey, setImportKey] = useState("");
  const [walletMode, setWalletMode] = useState<"generate" | "import">("generate");
  const [balanceError, setBalanceError] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (walletAddress) {
      loadBalance();
      loadHistory();
    }
  }, [walletAddress]);

  const loadBalance = async () => {
    if (!walletAddress) return;
    setBalanceError(false);
    const bal = await getBalance(walletAddress);
    setBalance(bal);
    if (bal === 0) {
      setBalanceError(true);
    }
  };

  const loadHistory = () => {
    const stored = localStorage.getItem("mix_history");
    if (stored) {
      const allHistory: MixTransaction[] = JSON.parse(stored);
      const userHistory = allHistory.filter(tx => tx.walletAddress === walletAddress);
      setHistory(userHistory);
    }
  };

  const saveTransaction = (signature: string, amount: number) => {
    if (!walletAddress) return;
    
    const transaction: MixTransaction = {
      signature,
      amount,
      timestamp: Date.now(),
      walletAddress,
    };

    const stored = localStorage.getItem("mix_history");
    const allHistory: MixTransaction[] = stored ? JSON.parse(stored) : [];
    allHistory.unshift(transaction);
    localStorage.setItem("mix_history", JSON.stringify(allHistory.slice(0, 100)));
    
    loadHistory();
  };

  const handleGenerateLaunchWallet = () => {
    const wallet = generateLaunchWallet();
    setLaunchWallet(wallet);
    setImportKey("");
    toast({
      title: "Launch Wallet Generated",
      description: "Private wallet created for your token launch",
    });
  };

  const handleImportLaunchWallet = () => {
    if (!importKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter a private key",
        variant: "destructive",
      });
      return;
    }

    const result = importLaunchWallet(importKey.trim());
    
    if ("error" in result) {
      toast({
        title: "Import Failed",
        description: result.error,
        variant: "destructive",
      });
      return;
    }

    setLaunchWallet(result);
    setImportKey("");
    toast({
      title: "Wallet Imported",
      description: "Private wallet imported successfully",
    });
  };

  const handleMixAndLaunch = async () => {
    if (!walletAddress || !depositAmount || !launchWallet) return;

    setMixing(true);
    setMixResult(null);
    setReadyToLaunch(false);
    
    try {
      const amount = parseFloat(depositAmount);
      const result = await mixSOL(amount, walletAddress, launchWallet.publicKey);
      
      if (result.success && result.depositSignature) {
        setMixResult({ signature: result.depositSignature });
        saveTransaction(result.depositSignature, amount);
        setReadyToLaunch(true);
        toast({
          title: "Mix Successful!",
          description: "SOL sent to your private launch wallet",
        });
        await loadBalance();
        setDepositAmount("");
      } else {
        toast({
          title: "Mix Failed",
          description: result.error || "Transaction failed",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    } finally {
      setMixing(false);
    }
  };

  const handleCopyPrivateKey = () => {
    if (launchWallet) {
      navigator.clipboard.writeText(launchWallet.privateKey);
      toast({
        title: "Copied!",
        description: "Private key copied to clipboard",
      });
    }
  };

  const handleDownloadPrivateKey = () => {
    if (launchWallet) {
      const blob = new Blob([launchWallet.privateKey], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `kurai-launch-wallet-${launchWallet.publicKey.slice(0, 8)}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast({
        title: "Downloaded!",
        description: "Private key saved to file",
      });
    }
  };

  const handleLaunchOnPumpFun = () => {
    window.open("https://pump.fun/create", "_blank");
    toast({
      title: "Redirecting to pump.fun",
      description: "Import your private key to Phantom to launch",
    });
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="border-primary/20 shadow-2xl shadow-primary/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Privacy Swapper</CardTitle>
            <Badge variant="outline" className="border-primary/40 text-primary">
              Mainnet
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {!walletAddress ? (
            <div className="text-center py-12 space-y-4">
              <Shield className="w-16 h-16 text-muted-foreground mx-auto opacity-50" />
              <p className="text-muted-foreground">Connect your wallet to continue</p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {!launchWallet ? (
                  <div className="p-6 rounded-lg border border-primary/20 bg-primary/5 space-y-4">
                    <div className="text-center">
                      <Shield className="w-12 h-12 text-primary mx-auto mb-3" />
                      <p className="font-medium text-foreground mb-1">Launch Wallet</p>
                      <p className="text-sm text-muted-foreground">
                        Generate or import a private wallet
                      </p>
                    </div>
                    
                    <div className="flex gap-2 p-1 rounded-lg bg-muted">
                      <Button
                        variant={walletMode === "generate" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setWalletMode("generate")}
                        className="flex-1"
                        data-testid="tab-generate"
                      >
                        Generate
                      </Button>
                      <Button
                        variant={walletMode === "import" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setWalletMode("import")}
                        className="flex-1"
                        data-testid="tab-import"
                      >
                        Import
                      </Button>
                    </div>
                    
                    {walletMode === "generate" ? (
                      <div className="space-y-3">
                        <p className="text-sm text-muted-foreground text-center">
                          Create a fresh wallet with no transaction history
                        </p>
                        <Button
                          onClick={handleGenerateLaunchWallet}
                          className="w-full shadow-lg shadow-primary/20"
                          data-testid="button-generate-wallet"
                        >
                          <Shield className="w-4 h-4 mr-2" />
                          Generate Private Wallet
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor="import-key" className="text-sm">Private Key</Label>
                          <Textarea
                            id="import-key"
                            placeholder="Paste your private key (base64 or JSON array)"
                            value={importKey}
                            onChange={(e) => setImportKey(e.target.value)}
                            className="min-h-24 font-mono text-xs"
                            data-testid="input-import-key"
                          />
                          <p className="text-xs text-muted-foreground">
                            Supports base64 or JSON array format
                          </p>
                        </div>
                        <Button
                          onClick={handleImportLaunchWallet}
                          className="w-full shadow-lg shadow-primary/20"
                          data-testid="button-import-wallet"
                        >
                          <Key className="w-4 h-4 mr-2" />
                          Import Wallet
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="p-4 rounded-lg border border-primary/20 bg-primary/5 space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-foreground">Launch Wallet Generated</p>
                        <Badge variant="outline" className="border-primary/40 text-primary">
                          Private
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Public Address</p>
                          <p className="text-sm font-mono text-foreground break-all">
                            {launchWallet.publicKey}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCopyPrivateKey}
                            className="flex-1"
                            data-testid="button-copy-key"
                          >
                            <Copy className="w-3 h-3 mr-2" />
                            Copy Key
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleDownloadPrivateKey}
                            className="flex-1"
                            data-testid="button-download-key"
                          >
                            <Download className="w-3 h-3 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg border border-primary/20 bg-primary/5">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-foreground">Privacy Swap</p>
                        <p className="text-xs text-muted-foreground">Mix your SOL for anonymous launch</p>
                      </div>
                      <Switch
                        checked={usePrivacySwap}
                        onCheckedChange={setUsePrivacySwap}
                        data-testid="switch-privacy-swap"
                      />
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="deposit" className="text-base">Deposit Amount</Label>
                    <p className="text-xs text-muted-foreground">
                      Balance: {balance.toFixed(4)} SOL
                    </p>
                  </div>
                  {balanceError && balance === 0 ? (
                    <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30">
                      <p className="text-xs text-destructive font-medium mb-1">⚠️ RPC Connection Issue</p>
                      <p className="text-xs text-muted-foreground">
                        Free public RPC endpoints are rate-limited. For reliable mainnet access, add a custom RPC URL as VITE_SOLANA_RPC environment variable (e.g., from Helius, QuickNode, or Alchemy).
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      Real SOL required for mainnet transactions
                    </p>
                  )}
                  <div className="relative">
                    <Input
                      id="deposit"
                      type="number"
                      placeholder="0.0"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      className="text-2xl h-16 pr-16 border-primary/30 focus:border-primary/50 shadow-lg shadow-primary/5"
                      data-testid="input-deposit-amount"
                      step="0.01"
                      min="0.01"
                      max={balance}
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                      SOL
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      Minimum: 0.01 SOL
                    </p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setDepositAmount(balance.toString())}
                      className="text-xs h-6"
                    >
                      Max
                    </Button>
                  </div>
                </div>

                {usePrivacySwap && depositAmount && (
                  <div className="p-4 rounded-lg bg-card border border-border space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Shuffle className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground">Privacy Flow</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 p-3 rounded-md bg-background border border-border text-center">
                        <p className="text-xs text-muted-foreground mb-1">Input</p>
                        <p className="font-mono font-medium">{depositAmount} SOL</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-primary" />
                      <div className="flex-1 p-3 rounded-md bg-primary/10 border border-primary/30 text-center">
                        <p className="text-xs text-muted-foreground mb-1">Output</p>
                        <p className="font-mono font-medium text-primary">{depositAmount} SOL*</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground text-center">
                      *Mixed through privacy protocol
                    </p>
                  </div>
                )}
              </div>

              {launchWallet && (
                <>
                  <Button
                    onClick={handleMixAndLaunch}
                    disabled={!depositAmount || mixing || parseFloat(depositAmount) < 0.01 || parseFloat(depositAmount) > balance}
                    className="w-full h-14 text-lg shadow-xl shadow-primary/30 border border-primary/50"
                    data-testid="button-mix-launch"
                  >
                    {mixing ? (
                      <>
                        <Shuffle className="w-5 h-5 mr-2 animate-spin" />
                        Mixing SOL...
                      </>
                    ) : (
                      <>
                        <Shuffle className="w-5 h-5 mr-2" />
                        {usePrivacySwap ? "Mix & Send to Launch Wallet" : "Send to Launch Wallet"}
                      </>
                    )}
                  </Button>

                  {mixResult && (
                    <div className="space-y-3">
                      <div className="p-4 rounded-lg bg-primary/10 border border-primary/30 space-y-2">
                        <div className="flex items-center gap-2 text-primary">
                          <CheckCircle2 className="w-5 h-5" />
                          <span className="font-medium">Transaction Successful</span>
                        </div>
                        <a
                          href={`https://explorer.solana.com/tx/${mixResult.signature}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          <span className="font-mono">{mixResult.signature.slice(0, 8)}...{mixResult.signature.slice(-8)}</span>
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>

                      {readyToLaunch && (
                        <Button
                          onClick={handleLaunchOnPumpFun}
                          className="w-full h-14 text-lg shadow-xl shadow-primary/30 border border-primary/50 bg-gradient-to-r from-primary to-cyan-500"
                          data-testid="button-launch-pumpfun"
                        >
                          <Rocket className="w-5 h-5 mr-2" />
                          Launch on pump.fun
                        </Button>
                      )}
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {launchWallet && readyToLaunch && (
        <Card className="border-primary/20 bg-gradient-to-br from-primary/10 to-cyan-500/10">
          <CardContent className="pt-6">
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <Rocket className="w-6 h-6 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground text-base mb-2">Launch Instructions</p>
                  <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                    <li>Your private key has been generated (copy/download above)</li>
                    <li>Import the private key into Phantom wallet</li>
                    <li>Switch to the imported wallet in Phantom</li>
                    <li>Click "Launch on pump.fun" to open pump.fun</li>
                    <li>Connect your wallet and create your token</li>
                  </ol>
                  <p className="text-xs text-primary mt-3">
                    ⚡ Your launch wallet is now funded with mixed SOL - no sniper can track it back to your main wallet
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {history.length > 0 && (
        <Card className="border-primary/20" id="transaction-history">
          <CardHeader>
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">Transaction History</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {history.map((tx, index) => (
                <div 
                  key={tx.signature}
                  className="p-4 rounded-lg border border-border bg-card/50 hover-elevate space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shuffle className="w-4 h-4 text-primary" />
                      <span className="font-medium text-foreground">{tx.amount} SOL</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {formatTimestamp(tx.timestamp)}
                    </div>
                  </div>
                  <a
                    href={`https://explorer.solana.com/tx/${tx.signature}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                    data-testid={`link-tx-${index}`}
                  >
                    <span className="font-mono text-xs">{tx.signature.slice(0, 12)}...{tx.signature.slice(-12)}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

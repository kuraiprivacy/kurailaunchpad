import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, Clock, CheckCircle2 } from "lucide-react";

interface CommitRevealFlowProps {
  onCommit: (hash: string) => void;
  onReveal: (params: any) => void;
}

export default function CommitRevealFlow({ onCommit, onReveal }: CommitRevealFlowProps) {
  const [stage, setStage] = useState<"uncommitted" | "committed" | "revealed">("uncommitted");
  const [commitHash, setCommitHash] = useState<string>("");
  const [revealCountdown, setRevealCountdown] = useState(300);

  useEffect(() => {
    if (stage === "committed" && revealCountdown > 0) {
      const timer = setInterval(() => {
        setRevealCountdown((prev) => Math.max(0, prev - 1));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [stage, revealCountdown]);

  const handleCommit = () => {
    const mockHash = `0x${Math.random().toString(16).substring(2, 66)}`;
    setCommitHash(mockHash);
    setStage("committed");
    console.log("Commitment created:", mockHash);
    onCommit(mockHash);
  };

  const handleReveal = () => {
    setStage("revealed");
    console.log("Parameters revealed");
    onReveal({ hash: commitHash });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {stage === "uncommitted" && <EyeOff className="w-5 h-5 text-muted-foreground" />}
            {stage === "committed" && <Clock className="w-5 h-5 text-primary animate-pulse" />}
            {stage === "revealed" && <CheckCircle2 className="w-5 h-5 text-primary" />}
            <CardTitle>Commit-Reveal Flow</CardTitle>
          </div>
          <Badge 
            variant={stage === "revealed" ? "default" : stage === "committed" ? "secondary" : "outline"}
            data-testid="badge-stage-status"
          >
            {stage === "uncommitted" && "Not Started"}
            {stage === "committed" && "Committed"}
            {stage === "revealed" && "Revealed"}
          </Badge>
        </div>
        <CardDescription>
          Prevent front-running with commitment-based launches
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {stage === "uncommitted" && (
          <div className="space-y-4">
            <div className="rounded-md border border-border p-4 bg-muted/30">
              <p className="text-sm text-muted-foreground">
                Generate a cryptographic commitment to your launch parameters. Parameters remain hidden until the reveal window opens.
              </p>
            </div>
            <Button 
              onClick={handleCommit} 
              className="w-full"
              data-testid="button-commit"
            >
              <EyeOff className="w-4 h-4 mr-2" />
              Generate Commitment
            </Button>
          </div>
        )}

        {stage === "committed" && (
          <div className="space-y-4">
            <div className="rounded-md border border-primary/30 bg-primary/5 p-4">
              <p className="text-xs text-muted-foreground mb-2">Commitment Hash</p>
              <p className="text-xs font-mono break-all text-foreground" data-testid="text-commit-hash">
                {commitHash}
              </p>
            </div>
            
            <div className="rounded-md border border-border p-4 bg-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Reveal Window Opens In</p>
                  <p className="text-xs text-muted-foreground">Parameters can be revealed after countdown</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-mono font-bold text-primary" data-testid="text-countdown">
                    {formatTime(revealCountdown)}
                  </p>
                </div>
              </div>
            </div>

            <Button 
              onClick={handleReveal}
              disabled={revealCountdown > 0}
              className="w-full"
              data-testid="button-reveal"
            >
              <Eye className="w-4 h-4 mr-2" />
              {revealCountdown > 0 ? `Reveal in ${formatTime(revealCountdown)}` : "Reveal Parameters"}
            </Button>
          </div>
        )}

        {stage === "revealed" && (
          <div className="space-y-4">
            <div className="rounded-md border border-primary/30 bg-primary/5 p-4">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <p className="text-sm font-medium text-foreground">Parameters Revealed</p>
              </div>
              <p className="text-xs text-muted-foreground">
                Your launch parameters are now public and verifiable on-chain.
              </p>
            </div>
            <div className="rounded-md border border-border p-4 bg-card">
              <p className="text-xs text-muted-foreground mb-2">Original Commitment</p>
              <p className="text-xs font-mono break-all text-foreground">
                {commitHash}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

import CommitRevealFlow from "@/components/CommitRevealFlow";

export default function CommitRevealPage() {
  const handleCommit = (hash: string) => {
    console.log("Commitment created:", hash);
  };

  const handleReveal = (params: any) => {
    console.log("Parameters revealed:", params);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Commit-Reveal Flow</h1>
        <p className="text-muted-foreground">
          Prevent front-running by committing to your launch parameters before revealing them
        </p>
      </div>
      <CommitRevealFlow onCommit={handleCommit} onReveal={handleReveal} />
    </div>
  );
}

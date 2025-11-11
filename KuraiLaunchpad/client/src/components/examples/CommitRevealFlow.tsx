import CommitRevealFlow from "../CommitRevealFlow";

export default function CommitRevealFlowExample() {
  const handleCommit = (hash: string) => {
    console.log("Committed:", hash);
  };

  const handleReveal = (params: any) => {
    console.log("Revealed:", params);
  };

  return (
    <div className="p-6">
      <CommitRevealFlow onCommit={handleCommit} onReveal={handleReveal} />
    </div>
  );
}

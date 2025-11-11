import EscrowDashboard from "@/components/EscrowDashboard";

export default function EscrowPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Escrow & Vesting Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor dev fund releases and vesting schedules with transparent on-chain tracking
        </p>
      </div>
      <EscrowDashboard />
    </div>
  );
}

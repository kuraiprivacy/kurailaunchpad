import AuditLog from "@/components/AuditLog";

export default function AuditLogPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Audit Log</h1>
        <p className="text-muted-foreground">
          Complete history of all launch events with verifiable on-chain transactions
        </p>
      </div>
      <AuditLog />
    </div>
  );
}

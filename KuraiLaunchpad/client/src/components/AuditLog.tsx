import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Search, ExternalLink, Download } from "lucide-react";

interface AuditEvent {
  id: string;
  type: "commit" | "reveal" | "batch_settlement" | "escrow_release";
  description: string;
  timestamp: number;
  txHash?: string;
}

const mockEvents: AuditEvent[] = [
  {
    id: "1",
    type: "commit",
    description: "Launch parameters committed",
    timestamp: Date.now() - 86400000,
    txHash: "5KqS8VNmN3FvK4r2xPnZ8wD3yXtJ9hB2cW1mR4pL6nE8",
  },
  {
    id: "2",
    type: "reveal",
    description: "Parameters revealed after commitment window",
    timestamp: Date.now() - 43200000,
    txHash: "7MpT9WOoP4GxL5s3yQoA9xE4zYuK0iC3dX2nS5qM7oF9",
  },
  {
    id: "3",
    type: "batch_settlement",
    description: "Batch auction settled with 127 orders",
    timestamp: Date.now() - 21600000,
    txHash: "9NqU0XPpQ5HyM6t4zRpB0yF5aZvL1jD4eY3oT6rN8pG0",
  },
  {
    id: "4",
    type: "escrow_release",
    description: "Initial vesting milestone released (10%)",
    timestamp: Date.now() - 3600000,
    txHash: "2LrV1YQqR6IzN7u5aSpC1zG6bAwM2kE5fZ4pU7sO9qH1",
  },
];

const eventTypeColors = {
  commit: "secondary",
  reveal: "default",
  batch_settlement: "default",
  escrow_release: "default",
} as const;

export default function AuditLog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [events] = useState<AuditEvent[]>(mockEvents);

  const filteredEvents = events.filter(
    (event) =>
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.txHash?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExportCSV = () => {
    console.log("Exporting audit log to CSV");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            <CardTitle>Audit Log</CardTitle>
          </div>
          <Button 
            size="sm" 
            variant="outline"
            onClick={handleExportCSV}
            data-testid="button-export-csv"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
        <CardDescription>
          Complete history of all launch events and transactions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by description or transaction hash..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            data-testid="input-search-audit"
          />
        </div>

        <div className="space-y-3">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">No events found</p>
            </div>
          ) : (
            filteredEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-start gap-4 p-4 rounded-md border border-border bg-card hover-elevate"
                data-testid={`event-${event.id}`}
              >
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={eventTypeColors[event.type]}>
                      {event.type.replace("_", " ")}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(event.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-foreground">{event.description}</p>
                  {event.txHash && (
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-mono text-muted-foreground">
                        TX: {event.txHash.slice(0, 8)}...{event.txHash.slice(-8)}
                      </p>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 px-2"
                        data-testid={`button-view-tx-${event.id}`}
                      >
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

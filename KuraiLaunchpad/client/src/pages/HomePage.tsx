import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Rocket, Shield } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center">
      <div className="text-center space-y-8 max-w-4xl mx-auto">
        <div className="space-y-4">
          <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-primary via-primary to-cyan-400 bg-clip-text text-transparent">
            Privacy First Launches
          </h1>
          <p className="text-xl text-muted-foreground">
            Mix your SOL. Launch anonymously.
          </p>
        </div>

        <div className="flex gap-4 justify-center pt-8">
          <Link href="/create">
            <Button 
              size="lg" 
              data-testid="button-get-started"
              className="text-lg px-8 py-6 shadow-2xl shadow-primary/30 border border-primary/50"
            >
              <Rocket className="w-5 h-5 mr-2" />
              Launch Token
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-16 max-w-2xl mx-auto">
          <div className="p-6 rounded-xl border border-primary/20 bg-card/50 backdrop-blur hover-elevate">
            <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Private by Default</h3>
            <p className="text-sm text-muted-foreground">
              Mix your SOL through our privacy swapper before launching
            </p>
          </div>

          <div className="p-6 rounded-xl border border-primary/20 bg-card/50 backdrop-blur hover-elevate">
            <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
              <Rocket className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Fair Launch</h3>
            <p className="text-sm text-muted-foreground">
              Anti-sniper protection built in
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

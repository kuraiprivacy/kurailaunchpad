import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/Header";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/HomePage";
import CreateLaunchPage from "@/pages/CreateLaunchPage";
import { usePhantomWallet } from "@/hooks/usePhantomWallet";

function Router({ walletAddress }: { walletAddress: string | null }) {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/create">
        {() => <CreateLaunchPage walletAddress={walletAddress} />}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const { walletAddress, connecting, connect, disconnect } = usePhantomWallet();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 pointer-events-none" />
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10">
            <Header
              walletAddress={walletAddress}
              connecting={connecting}
              onConnectWallet={connect}
              onDisconnectWallet={disconnect}
            />

            <main className="container mx-auto px-6 py-8">
              <Router walletAddress={walletAddress} />
            </main>
          </div>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

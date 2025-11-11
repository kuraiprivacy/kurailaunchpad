import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { Home, History } from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";
import logo from "@assets/SIDEQUEST (1) (1)_1762833304001.png";

interface HeaderProps {
  walletAddress: string | null;
  connecting: boolean;
  onConnectWallet: () => void;
  onDisconnectWallet: () => void;
}

export default function Header({ walletAddress, connecting, onConnectWallet, onDisconnectWallet }: HeaderProps) {
  const [location, setLocation] = useLocation();

  const handleHistoryClick = () => {
    if (location !== "/create") {
      setLocation("/create");
      setTimeout(() => {
        document.getElementById("transaction-history")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      document.getElementById("transaction-history")?.scrollIntoView({ behavior: "smooth" });
    }
  };
  
  return (
    <header className="border-b border-primary/10 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <div className="flex items-center gap-3 hover-elevate rounded-lg px-2 py-1 -ml-2 cursor-pointer">
                <img src={logo} alt="KURAI" className="w-12 h-12 object-contain" />
                <h1 className="text-2xl font-bold text-foreground" data-testid="text-app-title">KURAI</h1>
              </div>
            </Link>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setLocation("/")}
              data-testid="button-home" 
              className="border border-primary/20"
            >
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleHistoryClick}
              data-testid="button-history" 
              className="border border-primary/20"
            >
              <History className="w-4 h-4 mr-2" />
              History
            </Button>
          </div>
          
          <div className="flex items-center gap-3">
            <a 
              href="https://x.com/kuraiprivacy" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 rounded-lg border border-primary/20 hover-elevate active-elevate-2 transition-colors"
              data-testid="link-twitter"
            >
              <FaXTwitter className="w-5 h-5 text-foreground" />
            </a>
            
            {walletAddress ? (
              <>
                <div className="px-4 py-2 rounded-lg bg-primary/10 border border-primary/30 shadow-lg shadow-primary/5">
                  <p className="text-sm font-mono font-medium text-primary" data-testid="text-wallet-address">
                    {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={onDisconnectWallet}
                  data-testid="button-disconnect-wallet"
                  className="border-primary/30"
                >
                  Disconnect
                </Button>
              </>
            ) : (
              <Button 
                onClick={onConnectWallet}
                disabled={connecting}
                data-testid="button-connect-wallet"
                className="shadow-lg shadow-primary/20"
              >
                {connecting ? "Connecting..." : "Connect Phantom"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

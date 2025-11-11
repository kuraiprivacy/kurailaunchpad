import CreateLaunchForm from "@/components/CreateLaunchForm";

interface CreateLaunchPageProps {
  walletAddress: string | null;
}

export default function CreateLaunchPage({ walletAddress }: CreateLaunchPageProps) {
  return (
    <div className="py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-3">Launch Your Token</h1>
        <p className="text-muted-foreground">
          Private, secure, and fair
        </p>
      </div>
      <CreateLaunchForm walletAddress={walletAddress} />
    </div>
  );
}
